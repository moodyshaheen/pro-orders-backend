import express from 'express'
import { addToCart, removeFromCart, getCart, updateCartQuantity } from '../controllers/controlCart.js'
import authMidelWhere from '../middleware/authMidel.js';


const cartRoute = express.Router();



cartRoute.post("/add", authMidelWhere, addToCart)
cartRoute.post("/remove", authMidelWhere, removeFromCart)
cartRoute.post("/get", authMidelWhere, getCart)
cartRoute.post("/update", authMidelWhere, updateCartQuantity)



export default cartRoute;