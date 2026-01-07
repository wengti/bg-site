import { getTableConnection } from './getTableConnection.js'

const db = getTableConnection()

await db.exec(`
    DROP TABLE IF EXISTS users
    `)

await db.close()
