import express from 'express'
import { signup } from '../controllers/signupUser.js'

export const formRouter = express.Router()
formRouter.post('/signup', signup)