import express from 'express'
import { getItems, getGenre } from '../utils/getItems.js'

export const apiRouter = express.Router()
apiRouter.get('/', getItems)
apiRouter.get('/genre', getGenre)