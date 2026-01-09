import { getTableConnection } from '../table/getTableConnection.js'


export async function getMyInfo(req, res) {

    const db = getTableConnection()
    try {
        if (!req.session.userId) {
            await db.end()
            return res.json({ 
                isLoggedIn: false 
            })
        }
        else {
            const ret = await db.query(`
                SELECT name FROM users
                    WHERE id = $1
                `,
                [req.session.userId]
            )

            await db.end()
            
            const { name } = ret.rows[0]
            return res.json({ 
                isLoggedIn: true, 
                name
            })
        }
    }
    catch (err) {
        const name = 'Unaccessible user info'
        const message = 'User info is not retrievable.'
        await db.end()
        return res.status(500).json({name, message})
    }

}