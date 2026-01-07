import { getTableConnection } from './getTableConnection.js';

const db = getTableConnection()

await db.query(`
    UPDATE items
        SET 
            quantity = 1
        WHERE   
            id = 14
    `)

console.log('Succesful data update.')

await db.close()