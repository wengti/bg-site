import { getTableConnection } from './getTableConnection.js'

const db = getTableConnection()

try{
    await db.exec(`
        CREATE TABLE IF NOT EXISTS orders(
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            item_id INTEGER NOT NULL REFERENCES items(id),
            order_quantity INTEGER NOT NULL,
            order_time TIMESTAMP DEFAULT LOCALTIMESTAMP
        );
        `)
}
catch (err) {
    console.log('Failed table creation...')
    console.error(err)
}
finally {
    await db.close()
}