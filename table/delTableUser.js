import { getTableConnection } from './getTableConnection.js'

const db = getTableConnection()

await db.query(`
    DROP TABLE IF EXISTS users
    `)

await db.end()
