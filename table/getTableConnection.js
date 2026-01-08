import { PGlite } from '@electric-sql/pglite'
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';

export function getTableConnection() {

    return new PGlite('./data', {
        extensions: { unaccent }
    });
}
