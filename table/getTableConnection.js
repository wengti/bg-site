// import { PGlite } from '@electric-sql/pglite'
import { Pool } from 'pg'
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import 'dotenv/config'

export function getTableConnection() {
    // PGlite only suitable for local connection
    // return new PGlite('./data', {
    //     extensions: { unaccent }
    // });

    // Using PG instead
    const connectionString = process.env.SUPABASE_CONNECTION_STRING
    return new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false
    })

}
