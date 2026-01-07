import { getTableConnection } from '../table/getTableConnection.js'

export async function getItems(req, res) {

    const db = getTableConnection()
    try{
        let ret = ''
        const {search} = req.query

        if(!search){
            ret = await db.query(`
                SELECT * FROM items
                `)
        }
        else{

            ret = await db.query(`
                SELECT * FROM items
                    WHERE unaccent(title) ILIKE '%${search}%' OR
                          unaccent(designer) ILIKE '%${search}%'
                `)
        }

        
        res.json(ret.rows)

    }
    catch(err){
        res.status(500).json(err)
    }
    finally{
        await db.close()
    }
}

export async function getGenre(req, res){
    
    const db = getTableConnection()
    try{
        const ret = await db.query(`
            SELECT DISTINCT genre FROM items
            `)
        
        res.json(ret.rows)
    }
    catch(err){
        res.status(500).json(err)
    }
    finally{
        await db.close()
    }
}