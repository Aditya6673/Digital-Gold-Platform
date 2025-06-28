# 💰 Digital Gold Platform for Local Jewellers

A full-stack platform built to empower **local jewellers** with modern digital gold trading capabilities.  
Customers can **buy, hold, and redeem digital gold**, while jewellers manage pricing and inventory — all from a secure, self-hosted dashboard.

---

## 🚀 Features

### 👤 Customers
- Register/Login with secure JWT authentication
- Buy digital gold at real-time rates
- Track holdings and average price
- Request redemption (sell or convert to physical gold)

### 🛍 Shopkeepers
- Manage gold inventory
- Set custom pricing margin over global rate
- View and process customer redemption requests

### 🧑‍💼 Admin
- View and manage all users and shopkeepers
- Soft delete entities using `isDeleted` flag
- Access to pricing and audit controls

---

## 🧱 Tech Stack

- **Frontend**: React (planned)
- **Backend**: Node.js, Express, Mongoose, JWT
- **Database**: MongoDB (Atlas or local)
- **Auth**: JWT with role-based access (customer/shopkeeper/admin)
- **Security**: Soft deletes, protected routes, token expiry


