import express from 'express'
import { addToCart, countCart, listCart, delCartAll, delCart} from '../controllers/changeCart.js'

export const cartRouter = express.Router()
cartRouter.get('/', listCart)
cartRouter.get('/count', countCart)
cartRouter.post('/add', addToCart)
cartRouter.delete('/del/all', delCartAll)
cartRouter.delete('/del/:orderId', delCart)