import { getTableConnection } from './getTableConnection.js'
import bcrypt from 'bcryptjs'


const db = getTableConnection()

try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL
            );
            `)


    const password = await bcrypt.hash('test', 10)
    await db.query(`
            INSERT INTO users (name, username, email, password)
                VALUES ($1, $2, $3, $4)
            `,
        ['test', 'test', 'test@email.com', password]
    )
    console.log('[Users] Successful data insertion...')
}
catch (err) {
    console.log('Failed table creation...')
    console.error(err)
}
finally {
    await db.end()
}
