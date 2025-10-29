import express from 'express';
import { fetchDetailedGoldPrice } from '../utils/fetchGoldPrice.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

// Get current gold price with detailed information
router.get('/price', async (req, res) => {
  try {
    const { commodity, expiry } = req.query;
    const detailedPrice = await fetchDetailedGoldPrice({ commodity, expiry });
    res.json(detailedPrice);
  } catch (error) {
    console.error('Error fetching gold price:', error);
    res.status(500).json({ message: 'Failed to fetch gold price' });
  }
});

// removed legacy simple route; MCX is the single source

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
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating gold price:', error);
    res.status(500).json({ message: 'Failed to update gold price' });
  }
});

// Update gold price from external API (admin only)
router.post('/update-from-api', protect, isAdmin, async (req, res) => {
  try {
    const { commodity, expiry } = req.body || {};
    const detailedPrice = await fetchDetailedGoldPrice({ commodity, expiry });
    // Optionally: Save the price to your DB here
    res.json({
      ...detailedPrice,
      message: 'Price updated from external API'
    });
  } catch (error) {
    console.error('Error updating price from API:', error);
    res.status(500).json({ message: 'Failed to update price from API' });
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
          changeAmount: 50,
          direction: 'Increase',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          source: 'MCX'
        },
        {
          _id: '2',
          price: 6450,
          changeAmount: 30,
          direction: 'Decrease',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          source: 'MCX'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ message: 'Failed to fetch price history' });
  }
});

export default router; 