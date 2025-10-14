# Digital Gold Platform


<img width="1069" height="1068" alt="image" src="https://github.com/user-attachments/assets/1a6490ec-6ef5-489c-8482-0104fea8dbdb" />

A comprehensive digital gold investment platform with a modern React frontend and Node.js backend, featuring secure authentication, real-time gold price tracking, and portfolio management.

## 🏗️ Project Structure

```
digital-gold-platform/
├── backend/                 # Node.js/Express API server
│   ├── controllers/        # API route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middlewares/       # Express middlewares
│   ├── utils/             # Utility functions
│   └── server.mjs         # Server entry point
├── frontend/              # React frontend application
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── context/       # React context providers
    │   └── ...
    └── ...


## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digital-gold
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running on `http://localhost:3000`

## 🎨 Features

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Gold Price API**: Real-time gold price fetching and caching
- **Portfolio Management**: User holdings and transaction tracking
- **Admin Panel**: Administrative functions and user management
- **Audit Logging**: Comprehensive transaction and user activity logging
- **KYC Verification**: Know Your Customer verification system
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Centralized error handling and logging

### Frontend Features
- **Gold-themed Design**: Beautiful UI with rich gold (#FFD700), light beige (#F5F5DC), and bronze (#CD7F32) color scheme
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Real-time Dashboard**: Live portfolio overview and gold price tracking
- **Portfolio Management**: Detailed holdings and performance metrics
- **Transaction History**: Complete transaction tracking with filtering
- **Authentication**: Secure login and registration forms
- **Modern UI**: Clean, professional interface with gold-themed icons

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Holdings
- `GET /api/holdings` - Get user holdings
- `POST /api/holdings` - Create new holding
- `PUT /api/holdings/:id` - Update holding

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/recent` - Get recent transactions

### Gold Price
- `GET /api/gold/price` - Get current gold price

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/users/:id/kyc` - Update KYC status

## 🎯 Key Features

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation and sanitization

### User Experience
- Responsive design
- Smooth animations
- Real-time updates
- Intuitive navigation
- Professional gold-themed UI

### Performance
- Optimized database queries
- Caching for gold prices
- Efficient API responses
- Fast frontend build with Vite

## 🔧 Development

### Running in Development Mode

1. Start MongoDB:
   ```bash
   mongod
   ```

2. Start the backend (in one terminal):
   ```bash
   cd backend
   npm start
   ```

3. Start the frontend (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital-gold
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.


