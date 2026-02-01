import express from "express";
import { placeOrder, getUserOrders, getOrderById, getAllOrders } from "../controllers/controlOrder.js";
import authMidelWhere from "../middleware/authMidel.js";

const orderRoute = express.Router();

// Place order
orderRoute.post("/place", authMidelWhere, placeOrder);

// Get user orders
orderRoute.post("/my-orders", authMidelWhere, getUserOrders);

// Get all orders (Admin)
orderRoute.post("/all", authMidelWhere, getAllOrders);

// Get single order
orderRoute.post("/:orderId", authMidelWhere, getOrderById);

export default orderRoute;

