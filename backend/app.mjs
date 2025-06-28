import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';

// Import routes
import authRoutes from './routes/auth.mjs';
import inventoryRoutes from './routes/shopkeeper.mjs';
import holdingRoutes from './routes/holding.mjs';
import transactionRoutes from './routes/transactions.mjs';
import pricingRoutes from './routes/pricing.mjs';
import goldRoutes from './routes/gold.mjs';

// Optional: import redemptionRoutes, notificationRoutes later


dotenv.config(); // load .env
await connectDB(); // connect to MongoDB

const app = express();

app.use(express.json()); // parse JSON bodies

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/gold', goldRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('💰 Digital Gold Platform API is running');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;
