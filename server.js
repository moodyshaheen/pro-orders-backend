import express from "express"
import cors from "cors"
import { connectDb } from "./config/db.js"
import proRouter from "./routes/routePro.js"
import userRouter from "./routes/routeUser.js"
import 'dotenv/config'

// Debug environment variables
console.log("🔍 Environment Variables Check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");
import cartRoute from "./routes/routeCart.js"
import orderRoute from "./routes/routeOrder.js"
import { seedDatabase } from "./seedData.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// Enhanced middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// CORS configuration for production
app.use(cors({
    origin: [
        'https://modernstore-v1.surge.sh',
        'https://modernstore-admin-v1.surge.sh',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', req.body)
    }
    next()
})

//db connection
connectDb()

// Seed database with sample data (only if DB is connected)
setTimeout(() => {
    seedDatabase()
}, 3000)

// api endpoints
app.use("/api/product", proRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

// Enhanced root endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ModernStore API Working - Updated Version 2.1",
        version: "2.1.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            products: "/api/product/list",
            users: "/api/user/register",
            cart: "/api/cart",
            orders: "/api/order"
        },
        status: "online"
    })
})

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: "2.1.0"
    })
})

// Test endpoint for debugging
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Test endpoint working",
        timestamp: new Date().toISOString(),
        headers: req.headers,
        query: req.query
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.path,
        method: req.method
    })
})

app.listen(port, () => {
    console.log(`🚀 ModernStore Server Started on http://localhost:${port}`)
    console.log(`📊 Health Check: http://localhost:${port}/api/health`)
    console.log(`🧪 Test Endpoint: http://localhost:${port}/api/test`)
    console.log(`📦 Products: http://localhost:${port}/api/product/list`)
    console.log(`👤 Users: http://localhost:${port}/api/user/register`)
})

export default app