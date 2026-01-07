import express from 'express'
import { addToCart, countCart, listCart, delCartAll, delCart} from '../controllers/changeCart.js'
import { checkAuth } from '../middleware/middleware.js'

export const cartRouter = express.Router()
cartRouter.get('/', checkAuth, listCart)
cartRouter.get('/count', checkAuth, countCart)
cartRouter.post('/add', checkAuth, addToCart)
cartRouter.delete('/del/all', checkAuth, delCartAll)
cartRouter.delete('/del/:orderId', checkAuth, delCart)