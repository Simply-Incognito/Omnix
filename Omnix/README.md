<div align="center">
  <br />
  <h1>🚀 Omnix</h1>
  <p>
    <strong>A Scalable Multi-Tenant E-commerce Infrastructure</strong>
  </p>
  <p>
    A robust backend foundation for a unified commerce control center. Manage vendors, stores, products, orders, and analytics across an entire ecosystem.
  </p>
  <br />

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)]()
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)]()
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)]()
</div>

---

## 🌟 Overview

**Omnix** is an enterprise-grade multi-tenant e-commerce backend. It uses a **Shared Database, Isolated Logic** approach to handle multiple storefronts within a single platform. Whether you are a platform owner (Super Admin), a shop owner (Vendor), or a customer, Omnix provides a secure and performant environment.

## ✨ Features

### 🏢 Multi-Tenant Architecture
- **Header-Based Tenancy**: Uses `x-tenant-id` or `x-tenant-slug` for storefront context.
- **Data Isolation**: Vendors can only access and manage products/orders belonging to their store.
- **Dynamic Context**: Middleware automatically injects store information into requests based on the user's role or the requested tenant.

### 📊 Advanced Analytics
- **Super Admin Dashboard**: Global revenue per store, platform-wide user growth, and top-performing products.
- **Vendor Dashboard**: Store-specific revenue tracking, inventory value, and real-time sales metrics.
- **Optimized Aggregations**: Uses MongoDB `$lookup` and `$group` pipelines for high-performance reporting.

### 📦 Commerce Core
- **Inventory Management**: Automated stock subtraction during order creation with transactional safety.
- **Order Lifecycle**: Robust state machine for orders (`pending` → `processing` → `shipped` → `delivered`).
- **Product Engine**: Compound indexing to prevent duplicate product names within the same store.

### 🔒 Security & Performance
- **JWT & Cookies**: Secure authentication via JSON Web Tokens and HTTP-only cookies.
- **Rate Limiting**: Protection against brute-force and DDoS attacks.
- **Security Headers**: Powered by `helmet` for protection against common web vulnerabilities.
- **Error Handling**: Centralized operational error management with developer and production modes.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: Bcrypt.js, Helmet, Express-Rate-Limit, Cookie-Parser
- **Utilities**: Slugify, Validator, JWT

---

## 📁 Folder Structure

```bash
server/
├── config/             # Database and environment configuration
├── controllers/        # Request handlers & Business Logic
├── middleware/         # Auth, Tenant, and Error-handling middlewares
├── models/             # Mongoose schemas (Store, Product, Order, User)
├── routes/             # Scoped API route definitions
├── utils/              # Helper functions (AppError, asyncErrorHandler)
└── app.js              # Express application setup
```

---

## 🚀 Getting Started

### 1. Environment Configuration
Create a `server/config/config.env` file:
```env
PORT = 2003
LOCAL_DB_URI = mongodb://127.0.0.1/omnix_db
NODE_ENV = development
SECRET_KEY = 'your_long_secure_secret_string'
JWT_TOKEN_EXPIRES_IN = '24h'
```

### 2. Installation
```bash
cd server
npm install
```

### 3. Running the Server
```bash
# Development mode (with nodemon)
npm start
```

---

## 🛣️ Roadmap
- [ ] **Frontend**: Build a premium React/Next.js dashboard with Glassmorphism aesthetics.
- [ ] **Payments**: Integrate Stripe/Paystack for automated checkout and vendor payouts.
- [ ] **Notifications**: Implement real-time order updates via WebSockets.
- [ ] **AI Insights**: Predictive analytics for inventory restocking.

---

<div align="center">
  <p>Built with ❤️ for the future of multi-tenant commerce by <strong>Simply_Incognito</strong>.</p>
</div>
