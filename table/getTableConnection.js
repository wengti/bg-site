import { PGlite } from '@electric-sql/pglite'
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';

export function getTableConnection() {
    // Check if running in browser
    if (typeof window !== 'undefined') {
        return new PGlite('idb://data', {
            extensions: { unaccent }
        });
    }
    
    // Running in Node.js (local development)
    return new PGlite('./data', {
        extensions: { unaccent }
    });
}
