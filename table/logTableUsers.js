import { getTableConnection } from './getTableConnection.js'


const db = getTableConnection()

const ret = await db.query(`
    SELECT * FROM users
    `)

await db.end()

console.table(ret.rows)