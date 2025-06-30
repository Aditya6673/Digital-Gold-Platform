import ShopkeeperPricing from '../models/ShopkeeperPricing.mjs';
import GoldPriceFeed from '../models/GoldPriceFeed.mjs';

export const setShopkeeperPricing = async (req, res, next) => {
  try {
    const shopkeeperId = req.user.id;
    const { marginPerGram } = req.body;

    if (marginPerGram == null) {
      return res.status(400).json({ message: 'Margin per gram is required' });
    }

    const goldPrice = await GoldPriceFeed.findOne().sort({ updatedAt: -1 });

    if (!goldPrice) {
      return res.status(500).json({ message: 'No global gold price found' });
    }

    const pricePerGram = goldPrice.pricePerGram + parseFloat(marginPerGram);

    const updated = await ShopkeeperPricing.findOneAndUpdate(
      { shopkeeperId },
      { marginPerGram, pricePerGram, lastSyncedWithFeed: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Pricing updated',
      pricing: updated
    });
  } catch (err) {
    next(err);
  }
};

export const getShopkeeperPricing = async (req, res, next) => {
  try {
    const shopkeeperId = req.user.id;
    const pricing = await ShopkeeperPricing.findOne({ shopkeeperId ,isDeleted: false });

    if (!pricing) {
      return res.status(404).json({ message: 'No pricing found for shopkeeper' });
    }

    res.status(200).json(pricing);
  } catch (err) {
    next(err);
  }
};
