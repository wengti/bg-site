import express from 'express'
import { apiRouter } from './router/apiRouter.js'
import { formRouter } from './router/formRouter.js'
import { userRouter } from './router/userRouter.js'
import { cartRouter } from './router/cartRouter.js'
import { sessionMiddleware } from './middleware/session-config.js'
import session from 'express-session'
import 'dotenv/config'
import cors from 'cors'

const PORT = 8000


const app = express()

app.use(cors()) // Allow this application to communicate with Stripe API (payment gateway)
app.use(express.json()) // Convert incoming request body into object
app.use(sessionMiddleware)

/*
const secret = process.env.SESSION_SECRET
app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true
    }
}))
*/

app.use(express.static('public'))

app.use('/api', apiRouter)
app.use('/form', formRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter)


app.listen(PORT, () => console.log(`Connected at PORT ${PORT}`))

