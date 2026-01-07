import { getTableConnection } from './getTableConnection.js'


const db = getTableConnection()

const ret = await db.query(`
    SELECT * FROM items
    `)

await db.close()

const result = ret.rows.map( ({id, title, designer, price, genre, img}) => {
    return {
        id,
        title,
        designer,
        price,
        genre,
        img: img.slice(0, 50)
    }
})

console.table(result)