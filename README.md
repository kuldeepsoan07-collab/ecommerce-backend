# 🛒 E-Commerce Backend API

A production-ready RESTful backend API for a full-stack E-Commerce application built with Node.js, Express.js and MongoDB.

The backend provides authentication, product management, cart/order workflow, admin functionality and Cloudinary image uploads.

---

## 🚀 Live Backend

API Base URL:

https://ecommerce-backend-if10.onrender.com

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API

### Authentication & Security
- JSON Web Token (JWT)
- Role-Based Access Control
- Admin Authentication
- Password Authentication
- Protected API Routes

### File Upload
- Cloudinary
- Multer
- Image Upload & Storage

### Other Technologies
- CORS
- Cookie Parser
- Morgan
- dotenv

### Deployment
- Render
- MongoDB Atlas
- Cloudinary

---

## ✨ Features

### 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Get Current User
- Refresh Token
- Logout
- Logout from All Devices
- Email Verification

---

### 👑 Admin Features

- Admin Authentication
- Role-Based Authorization
- Admin Product Management
- Create Product
- Update Product
- Delete Product
- View All Orders
- Update Order Status
- Cloudinary Product Image Upload

---

### 📦 Product Management

- Create Products
- Get All Products
- Get Product by ID
- Update Products
- Delete Products
- Product Categories
- Product Pricing
- Product Stock Management
- Product Ratings
- Product Discounts
- Product Images

---

### 🛍️ Order Management

- Create Order
- Get Logged-in User Orders
- Admin View All Orders
- Update Order Status
- Stock Validation
- Automatic Stock Reduction
- Shipping Calculation

### Order Status

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

---

### 💳 Payment

The application currently supports the following payment methods in the order workflow:

- Cash on Delivery (COD)
- UPI
- Card

Online Razorpay payment integration is currently disabled.

---

### ☁️ Cloudinary Image Upload

Product images are uploaded to Cloudinary instead of being stored directly on the server.

Upload flow:

Client → Backend → Multer → Cloudinary → Image URL → MongoDB

Maximum image size:

```text
5 MB
