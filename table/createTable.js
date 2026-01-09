import { getTableConnection } from './getTableConnection.js'
import { data } from './rawData.js'

const db = getTableConnection()

await db.query(`
        CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            designer TEXT NOT NULL,
            price FLOAT NOT NULL,
            genre TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            img TEXT NOT NULL
        )
        `
)

await db.query(`
        CREATE EXTENSION IF NOT EXISTS unaccent
    `)

try {

    await db.query('BEGIN')
    for (let { title, designer, price, genre, quantity, img } of data) {

        // Check if there are repeated item
        const ret = await db.query(`
                SELECT title FROM items
                    WHERE title ILIKE $1
                `,
            [title.trim()]
        )

        if (ret.rows.length > 0) {
            throw new Error(`Repeated item found: ${ret.rows[0].title}`)
        }

        await db.query(`
                INSERT INTO items (title, designer, price, genre, quantity, img)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
            [title, designer, price, genre, quantity, img]
        )
    }

    console.log('Successful data insertion...')
    await db.query('COMMIT')


}
catch (err) {
    await db.query('ROLLBACK')
    console.log('Failed data insertion...')
    console.error(err)
}
finally {
    await db.end()
}
