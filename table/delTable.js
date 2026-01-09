import { getTableConnection } from './getTableConnection.js'

const db = getTableConnection()

await db.query(`
    DROP TABLE IF EXISTS items
    `)

await db.end()
