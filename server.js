import express from 'express'
import { apiRouter } from './router/apiRouter.js'
import { formRouter } from './router/formRouter.js'
import { userRouter } from './router/userRouter.js'
import { cartRouter } from './router/cartRouter.js'
import session from 'express-session'
import 'dotenv/config'

const PORT = 8000
const secret = process.env.SESSION_SECRET

const app = express()

app.use(express.json()) // Convert incoming request body into object

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

app.use(express.static('public'))

app.use('/api', apiRouter)
app.use('/form', formRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter)


app.listen(PORT, () => console.log(`Connected at PORT ${PORT}`))

