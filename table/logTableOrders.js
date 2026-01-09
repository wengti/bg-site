import { getTableConnection } from './getTableConnection.js'

const db = getTableConnection()

const ret = await db.query(`
    SELECT * FROM orders
    `)

await db.end()

console.table(ret.rows)