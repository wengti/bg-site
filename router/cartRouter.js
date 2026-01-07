import express from 'express'
import { addToCart, countCart } from '../controllers/changeCart.js'

export const cartRouter = express.Router()
cartRouter.get('/count', countCart)
cartRouter.post('/add', addToCart)