import { createTable } from './createTable.js';
import { createTableOrders } from './createTableOrders.js';
import { createTableUsers } from './createTableUsers.js';

export async function initializeTable() {
    await createTable()
    await createTableUsers()
    await createTableOrders()
}