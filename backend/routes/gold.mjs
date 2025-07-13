import express from 'express';
import { fetchGoldPriceInINR } from '../utils/fetchGoldPrice.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

// Get current gold price
router.get('/price', async (req, res) => {
  try {
    const price = await fetchGoldPriceInINR();
    res.json({ price });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    res.status(500).json({ message: 'Failed to fetch gold price' });
  }
});

// Update gold price (admin only)
router.post('/update-price', protect, isAdmin, async (req, res) => {
  try {
    const { price } = req.body;
    
    if (!price || isNaN(price)) {
      return res.status(400).json({ message: 'Invalid price' });
    }

    // Here you would typically save the price to a database
    // For now, we'll just return the price
    res.json({ 
      price: parseFloat(price),
      message: 'Price updated successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error updating gold price:', error);
    res.status(500).json({ message: 'Failed to update gold price' });
  }
});

// Get price history (admin only)
router.get('/price-history', protect, isAdmin, async (req, res) => {
  try {
    // Here you would typically fetch from a database
    // For now, we'll return a mock response
    res.json({ 
      history: [
        {
          _id: '1',
          price: 6500,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          source: 'API'
        },
        {
          _id: '2',
          price: 6450,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          source: 'Manual'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ message: 'Failed to fetch price history' });
  }
});

export default router; 