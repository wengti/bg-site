import { getTableConnection } from '../table/getTableConnection.js'

export async function getItems(req, res) {

    const db = getTableConnection()
    try{
        let ret = ''
        const {search} = req.query

        if(!search){
            ret = await db.query(`
                SELECT * FROM items
                    WHERE quantity > 0
                    ORDER BY title
                `)
        }
        else{

            ret = await db.query(`
                SELECT * FROM items
                    WHERE (unaccent(title) ILIKE '%${search}%' OR
                          unaccent(designer) ILIKE '%${search}%') AND
                          quantity > 0
                    ORDER BY title
                `)
        }

        await db.end()
        return res.json(ret.rows)

    }
    catch(err){
        await db.end()
        return res.status(500).json(err)
    }
}

export async function getGenre(req, res){
    
    const db = getTableConnection()
    try{
        const ret = await db.query(`
            SELECT DISTINCT genre FROM items
            `)
        
        await db.end()
        return res.json(ret.rows)
    }
    catch(err){
        await db.end()
        return res.status(500).json(err)
    }

}