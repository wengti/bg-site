import { getTableConnection } from '../table/getTableConnection.js'

export async function addToCart(req, res) {

    const db = getTableConnection()

    try {
        // Check if there is at least 1 for that item
        const { itemId } = req.body
        const ret = await db.query(`
            SELECT quantity FROM items
                WHERE id = $1
            `,
            [itemId]
        )
        const { quantity } = ret.rows[0]

        if (quantity <= 0) {
            await db.close()
            const name = 'Insufficient stock.'
            const message = 'This item is out of stock.'
            return res.status(400).json({ name, message })
        }


        // Remove 1 quantity from the items table
        await db.query(`
            UPDATE items
                SET
                    quantity = quantity - 1
                WHERE
                    id = $1
            `,
            [itemId]
        )

        // Check if this item is in orders table
        const isOrdered = await db.query(`
            SELECT * FROM orders
                WHERE user_id = $1 AND item_id = $2
            `,
            [req.session.userId, itemId]
        )


        // Add 1 quantity to the orders table
        if (isOrdered.rows.length > 0) {
            await db.query(`
                UPDATE orders
                    SET
                        order_quantity = order_quantity + 1
                    WHERE
                        user_id = $1 AND item_id = $2
                `,
                [req.session.userId, itemId]
            )
        }
        else {
            await db.query(`
                INSERT INTO orders (user_id, item_id, order_quantity)
                    VALUES ($1, $2, 1)
                `,
                [req.session.userId, itemId]
            )
        }


        await db.close()
        const message = 'Success: The item has been added to the cart.'
        const curQuantity = quantity - 1
        return res.json({ message, curQuantity })


    }
    catch (err) {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.close()
        return res.status(500).json({ name, message })
    }

}


export async function countCart(req, res) {

    const db = getTableConnection()

    try {
        const finalRet = await db.query(`
            SELECT SUM(order_quantity) AS total_order FROM orders
                WHERE user_id = $1
                GROUP BY user_id
            `,
            [req.session.userId]
        )
        const { total_order: totalOrder } = finalRet.rows[0]

        await db.close()
        return res.json({totalOrder})
    }
    catch {
        const name = 'Server side error.'
        const message = 'Server side error.'
        await db.close()
        return res.status(500).json({name, message})
    }
}