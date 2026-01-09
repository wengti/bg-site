import { getTableConnection } from './getTableConnection.js'


const db = getTableConnection()

try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS orders(
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                item_id INTEGER NOT NULL REFERENCES items(id),
                order_quantity INTEGER NOT NULL,
                order_time TIMESTAMP DEFAULT LOCALTIMESTAMP
            );
            `)
    console.log('[Orders] Successful data insertion...')
}
catch (err) {
    console.log('Failed table creation...')
    console.error(err)
}
finally {
    await db.end()
}
