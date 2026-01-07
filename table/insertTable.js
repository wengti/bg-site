import { getTableConnection } from './getTableConnection.js'
import { data } from './newData.js'



const db = getTableConnection()

try {    
    await db.transaction(async (tx) => {

        for (let { title, designer, price, genre, quantity, img } of data) {

            // Check if there are repeated item
            const ret = await tx.query(`
            SELECT title FROM items
                WHERE title ILIKE $1
            `,
                [title.trim()]
            )

            if (ret.rows.length > 0) {
                throw new Error(`Repeated item found: ${ret.rows[0].title}`)
            }

            await tx.query(`
            INSERT INTO items (title, designer, price, genre, quantity, img)
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
                [title, designer, price, genre, quantity, img]
            )
        }

        console.log('Successful data insertion...')
    })

}
catch (err) {
    console.log('Failed data insertion...')
    console.error(err)
}
finally {
    await db.close()
}



