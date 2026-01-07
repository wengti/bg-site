import express from 'express'
import { signup } from '../controllers/signupUser.js'
import { login, logout } from '../controllers/loginUser.js'
import { checkAuth } from '../middleware/middleware.js'

export const formRouter = express.Router()
formRouter.post('/signup', signup)
formRouter.post('/login', login)
formRouter.post('/logout', checkAuth, logout)