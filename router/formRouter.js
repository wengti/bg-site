import express from 'express'
import { signup } from '../controllers/signupUser.js'
import { login } from '../controllers/loginUser.js'

export const formRouter = express.Router()
formRouter.post('/signup', signup)
formRouter.post('/login', login)