import express from 'express'
import { getMyInfo } from '../controllers/getUserInfo.js'
import { checkAuth } from '../middleware/middleware.js'

export const userRouter = express.Router()
userRouter.get('/me', checkAuth, getMyInfo)