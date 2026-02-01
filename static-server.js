import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import proRouter from "./routes/routePro.js";
import userRouter from "./routes/routeUser.js";
import cartRoute from "./routes/routeCart.js";
import orderRoute from "./routes/routeOrder.js";
import { seedDatabase } from "./seedData.js";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: ['https://modernstore-v1.surge.sh', 'https://modernstore-admin-v1.surge.sh', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// Database connection
connectDb();

// Seed database with sample data (only if DB is connected)
setTimeout(() => {
    seedDatabase();
}, 2000);

// API endpoints
app.use("/api/product", proRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ModernStore Backend API is running!",
        version: "1.0.0",
        endpoints: {
            products: "/api/product",
            users: "/api/user",
            cart: "/api/cart",
            orders: "/api/order"
        }
    });
});

// API status endpoint
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        status: "online",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        path: req.path
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 ModernStore Backend Server Started on http://localhost:${port}`);
    console.log(`📊 API Status: http://localhost:${port}/api/status`);
    console.log(`📦 Products API: http://localhost:${port}/api/product/list`);
});

export default app;