import { getTableConnection } from '../table/getTableConnection.js'
import bcrypt from 'bcryptjs'

export async function login(req, res){

    const db = getTableConnection()

    try{
        const {username, password} = req.body

        // Sanitize input
        if(!username || !password){
            const name = 'Incomplete Credentials'
            const message = 'Not all the input fields are filled.'
            res.status(400).json({name, message})
        }

        // Get password from db
        const ret = await db.query(`
            SELECT id, password FROM users
                WHERE username = $1
            `,
            [username]
        )

        // Compare password
        if (await bcrypt.compare(password, ret.rows[0].password)){

            //Create a session for the user with its userId
            req.session.userId = ret.rows[0].id

            const message = 'Success: The user has been logged in.'
            return res.json({message})
        }
        else{
            const name = 'Invalid credentials.'
            const message = 'Invalid username or password.'
            return res.status(401).json({name, message})
        }
    }
    catch(err){
        const name = 'Server side error.'
        const message = 'Server side error.'
        return res.status(500).json({name, message})
    }
    finally{
        await db.close()
    }

}