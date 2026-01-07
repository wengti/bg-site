import { getTableConnection } from './getTableConnection.js'


const db = getTableConnection()

const ret = await db.query(`
    SELECT * FROM items
    `)

await db.close()

const result = ret.rows.map( ({id, title, designer, price, genre, quantity, img}) => {
    return {
        id,
        title,
        designer,
        price,
        genre,
        quantity,
        img: img.slice(0, 50)
    }
})

console.table(result)