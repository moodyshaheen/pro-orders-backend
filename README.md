# ModernStore Backend API

E-commerce backend API built with Node.js, Express, and MongoDB.

## Features

- 🔐 User Authentication (JWT)
- 📦 Product Management (CRUD)
- 🛒 Shopping Cart
- 📋 Order Management
- 🖼️ Image Upload (Base64)
- 🔒 Secure API Endpoints
- 📊 MongoDB Integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **CORS** - Cross-origin requests

## API Endpoints

### Products
- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product
- `PUT /api/product/update/:id` - Update product
- `DELETE /api/product/remove` - Delete product

### Users
- `POST /api/user/register` - Register user
- `POST /api/user/login` - Login user
- `GET /api/user/me` - Get user profile

### Cart & Orders
- `POST /api/cart/add` - Add to cart
- `POST /api/order/place` - Place order
- `GET /api/order/list` - Get user orders

## Environment Variables

```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
PORT=4000
```

## Installation

```bash
npm install
npm start
```

## Deployment

This backend is configured for deployment on:
- Railway.app
- Render.com
- Vercel
- Replit
- Docker

## Live API

🌐 **API URL**: https://your-backend-url.railway.app

## Status

✅ **Status**: Online  
📊 **Health Check**: `/api/health`  
🧪 **Test Endpoint**: `/api/test`