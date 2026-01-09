import { getTableConnection } from '../table/getTableConnection.js'

export async function getItems(req, res) {

    const db = getTableConnection()
    try {
        let ret = ''
        const { search } = req.query

        if (!search) {
            ret = await db.query(`
                SELECT * FROM items
                    WHERE quantity > 0
                    ORDER BY title
                `)
        }
        else {
            ret = await db.query(`
                SELECT * FROM items
                    WHERE (unaccent(title) ILIKE '%${search}%' OR
                          unaccent(designer) ILIKE '%${search}%') AND
                          quantity > 0
                    ORDER BY title
                `)
        }
        
        // Adjust the quantity to be displayed only if the user logs in
        if (req.session.userId){
            // Deduct from the order quantity
            const orderRet = await db.query(`
                SELECT item_id, order_quantity FROM orders
                    WHERE user_id = $1
                `,
                [req.session.userId]
            )
    
            // loop through orderRet.rows
            // find the corresponding item from ret.rows
            // Adjust the quantity
            // return the correct ret.rows
            if (orderRet.rows.length > 0 && ret.rows.length > 0){
                for (const { item_id: orderItemId, order_quantity: orderQuantity } of orderRet.rows) {
                    const idx = ret.rows.findIndex(entry => entry.id === orderItemId)
                    // If the ret.rows contain the items that are add to cart
                    // If falsy idx = -1
                    if(idx >= 0){
                        ret.rows[idx].quantity -= orderQuantity
                    }
                }
            }
        }


        await db.end()
        return res.json(ret.rows)

    }
    catch (err) {
        console.log(err)
        await db.end()
        return res.status(500).json(err)
    }
}

export async function getGenre(req, res) {

    const db = getTableConnection()
    try {
        const ret = await db.query(`
            SELECT DISTINCT genre FROM items
            `)

        await db.end()
        return res.json(ret.rows)
    }
    catch (err) {
        await db.end()
        return res.status(500).json(err)
    }

}