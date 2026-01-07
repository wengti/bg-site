import express from 'express'
import { apiRouter } from './router/apiRouter.js'

const app = express()

app.use(express.json()) // Convert incoming request body into object

app.use(express.static('public'))

app.use('/api', apiRouter)

const PORT = 8000
app.listen(PORT, () => console.log(`Connected at PORT ${PORT}`))

