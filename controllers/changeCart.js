import { getTableConnection } from '../table/getTableConnection.js'
import Stripe from 'stripe'
import 'dotenv/config'

export async function addToCart(req, res) {

    const db = getTableConnection()

    try {

        const { itemId } = req.body


        // Check if this item is in orders table
        const isOrdered = await db.query(`
            SELECT o.order_quantity, i.quantity FROM orders o
                LEFT JOIN items i ON i.id = o.item_id
                WHERE o.item_id = $1 AND o.user_id = $2
            `,
            [itemId, req.session.userId]
        )


        // If this is ordered before
        if (isOrdered.rows.length > 0) {

            // First check if there are sufficient quantity to be ordered
            const { quantity, order_quantity: orderQuantity } = isOrdered.rows[0] //Available quantity from the items
            if (orderQuantity >= quantity) {
                await db.end()
                const name = 'lowStock'
                const message = 'This item is out of stock.'
                return res.status(400).json({ name, message })
            }

            // After confirm that there is enough stock to be ordered
            // Add to the cart
            // Because the order quantity here is before add-to-cart, so need to +1
            const newOrderQuantity = orderQuantity + 1
            await db.query(`
                UPDATE orders
                    SET
                        order_quantity = $1
                    WHERE
                        user_id = $2 AND item_id = $3
                `,
                [newOrderQuantity, req.session.userId, itemId]
            )

            // check the latest order quantity

            await db.end()
            const message = 'Success: The item has been added to the cart.'
            const curQuantity = quantity - newOrderQuantity
            return res.json({ message, curQuantity })
        }
        else {
            await db.query(`
                INSERT INTO orders (user_id, item_id, order_quantity)
                    VALUES ($1, $2, 1)
                `,
                [req.session.userId, itemId]
            )

            const finalRet = await db.query(`
                SELECT quantity FROM items
                    WHERE id = $1
                `,
                [itemId]
            )

            await db.end()
            const message = 'Success: The item has been added to the cart.'
            const curQuantity = finalRet.rows[0].quantity - 1
            return res.json({ message, curQuantity })
        }


    }
    catch (err) {
        console.error(err)
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }

}


// Update the maximum number of items that is possible to be ordered
async function checkCartMax(req) {

    const db = getTableConnection()
    // In case where multiple users add to cart for the same items
    // Make sure the items that are added to cart still match what is available in items
    const initialRet = await db.query(`
            SELECT o.id, o.order_quantity, i.quantity FROM orders o
                LEFT JOIN items i ON i.id = o.item_id
                WHERE user_id = $1
            `,
        [req.session.userId]
    )

    for (let { id: orderId, order_quantity: orderQuantity, quantity } of initialRet.rows) {
        if (orderQuantity > quantity) {
            await db.query(`
                    UPDATE orders
                        SET
                            order_quantity = $1
                        WHERE
                            id = $2
                    `,
                [quantity, orderId]
            )
        }
    }
}

export async function countCart(req, res) {

    await checkCartMax(req)
    const db = getTableConnection()

    try {
        const ret = await db.query(`
            SELECT SUM(order_quantity) AS total_order FROM orders
                WHERE user_id = $1
                GROUP BY user_id
            `,
            [req.session.userId]
        )

        let totalOrder = 0
        if (ret.rows.length !== 0) {
            totalOrder = ret.rows[0].total_order
        }

        await db.end()
        return res.json({ totalOrder })
    }
    catch {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }
}


export async function listCart(req, res) {
    const db = getTableConnection()

    try {

        const ret = await db.query(`
            SELECT o.id, o.order_quantity, i.title, i.price FROM orders o
                LEFT JOIN items i ON o.item_id = i.id
                WHERE o.user_id = $1 AND o.order_quantity > 0
            `,
            [req.session.userId]
        )

        await db.end()
        return res.json(ret.rows)


    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }
}


export async function delCart(req, res) {
    const db = getTableConnection()

    try {
        const { orderId } = req.params

        // Determine how many quantity and id are there in the order
        const ret = await db.query(`
            SELECT item_id, order_quantity FROM orders
                WHERE id = $1
            `,
            [orderId]
        )
        const { item_id: itemId, order_quantity: orderQuantity } = ret.rows[0]

        // // Add them back to the stock
        // await db.query(`
        //     UPDATE items
        //         SET quantity = quantity + $1
        //         WHERE id = $2
        //     `,
        //     [orderQuantity, itemId]
        // )

        // Delete the order
        await db.query(`
            DELETE FROM orders
                WHERE id = $1;
            `,
            [orderId]
        )

        await db.end()
        return res.status(204).send()
    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }
}

export async function delCartAll(req, res) {
    const db = getTableConnection()

    try {
        // This indicates the order has been completed
        // so the item must be cleared from the items table

        // First loop through all the orders and for each item_id remove that amount 
        const orderRet = await db.query(`
            SELECT item_id, order_quantity FROM orders
                WHERE user_id = $1
            `,
            [req.session.userId]
        )

        for (let { item_id: itemId, order_quantity: orderQuantity } of orderRet.rows) {
            await db.query(`
                UPDATE items
                    SET 
                        quantity = quantity - $1
                    WHERE 
                        id = $2
                `,
                [orderQuantity, itemId]
            )
        }

        // DELETE ORDERS from orders
        await db.query(`
            DELETE FROM orders
                WHERE user_id = $1
            `,
            [req.session.userId]
        )



        await db.end()
        return res.status(204).send()
    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }
}

export async function checkout(req, res) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const db = getTableConnection()

    try {

        const orderRet = await db.query(`
            SELECT o.order_quantity, i.title, i.price FROM orders o
                LEFT JOIN items i ON o.item_id = i.id
                WHERE o.user_id = $1 AND order_quantity > 0
            `,
            [req.session.userId]
        )

        const line_items = orderRet.rows.map(order => {
            return {
                price_data: {
                    currency: 'myr',
                    product_data: {
                        name: order.title,
                    },
                    unit_amount: order.price * 100, // Evaluated in smallest unit, sen
                },
                quantity: order.order_quantity,
            }
        })

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items,
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.SERVER_URL
        })

        await db.end()
        return res.json({ url: session.url })
    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.end()
        return res.status(500).json({ name, message })
    }
}