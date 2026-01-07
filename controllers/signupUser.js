import validator from 'validator'
import bcrypt from 'bcryptjs'
import { getTableConnection } from '../table/getTableConnection.js'

export async function signup(req, res){

    const db = getTableConnection()
    try{
        // --------------
        // Sanitize data
        // --------------
        let {name, username, email, password} = req.body

        // Check if all fields are filled
        if (!name || !username || !email || !password){
            const name = 'Incomplete input'
            const message = 'Not all input fields are filled.'
            return res.status(400).json({name, message})
        }

        // Check trim whitespaces
        name = name.trim()
        username = username.trim()
        email = email.trim()
    
        // Check if username is valid
        const pattern = /^[a-zA-Z0-9_-]{1,20}$/
        if(!pattern.test(username)){
            const name = 'Invalid username'
            const message = 'Invalid username. It should only contains a-z, A-Z, 0-9, _ or - and are within 1 to 20 characters.'
            return res.status(400).json({name , message})
        }
        
        // Check if email is valid
        if(!validator.isEmail(email)){
            const name = 'Invalid email'
            const message = 'Invalid email format.'
            return res.status(400).json({name , message})
        }

        // Check repeated account
        const check = await db.query(`
            SELECT * FROM users
                WHERE username = $1 OR email = $2
            `,
            [username, email]
        )
        if(check.rows.length > 0){
            const name = 'Repeated username or email.'
            const message = 'This username or email has been registered before.'
            return res.status(400).json({name, message})
        }

        // Check strong password
        if(!validator.isStrongPassword(password)){
            const name = 'Weak Password.'
            const message = 'Password must contain at least 8 characters, 1 lowerCase, 1 upperCase, 1 number and 1 symbol.'
            return res.status(400).json({name, message})
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10)
        

        // Insert user into database
        await db.query(`
            INSERT INTO users (name, username, email, password)
                VALUES ($1, $2, $3, $4)
            `,
            [name, username, email, hashed]
        )
        
        // Create a session and insert the userId
        const ret = await db.query(`
            SELECT id FROM users
                WHERE username = $1
            `,
            [username]
        )
        req.session.userId = ret.rows[0].id

        const message = 'Success: The user has been registered.'
        return res.status(201).json({message})

    }
    catch(err){
        const name = 'Server side error'
        const message = 'Server side error. Please try again.'
        return res.status(500).json(name, message)
    }
    finally{
        await db.close()
    }

}