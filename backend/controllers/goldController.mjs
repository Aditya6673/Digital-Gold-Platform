import GoldPriceFeed from '../models/GoldPriceFeed.mjs';
import GoldPriceHistory from '../models/GoldPriceHistory.mjs';

export const setGoldPrice = async (req, res, next) => {
  try {
    const { pricePerGram, source = 'Manual', currency = 'INR' } = req.body;

    if (!pricePerGram || isNaN(pricePerGram)) {
      return res.status(400).json({ message: 'Valid pricePerGram is required' });
    }

    const entry = await GoldPriceFeed.create({
      pricePerGram,
      currency,
      source,
      updatedAt: new Date()
    });

    // Optional: Store in price history too
    await GoldPriceHistory.create({
      shopkeeperId: null,
      pricePerGram,
      updatedAt: new Date()
    });

    res.status(201).json({ message: 'Gold price updated', price: entry });
  } catch (err) {
    next(err);
  }
};

export const getLatestGoldPrice = async (req, res, next) => {
  try {
    const latest = await GoldPriceFeed.findOne().sort({ updatedAt: -1 });

    if (!latest) return res.status(404).json({ message: 'No gold price found' });

    res.status(200).json(latest);
  } catch (err) {
    next(err);
  }
};

export const getGoldPriceHistory = async (req, res, next) => {
  try {
    const history = await GoldPriceHistory.find().sort({ updatedAt: -1 }).limit(50);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};
