import express from 'express'
import { getMyInfo } from '../controllers/getUserInfo.js'

export const userRouter = express.Router()
userRouter.get('/me', getMyInfo)