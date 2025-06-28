import GoldInventory from '../models/GoldInventory.mjs';
import ShopkeeperPricing from '../models/ShopkeeperPricing.mjs';

export const updateInventory = async (req, res, next) => {
  try {
    const shopkeeperId = req.user.id;
    const { availableGrams, marginPerGram } = req.body;

    const pricing = await ShopkeeperPricing.findOne({ shopkeeperId });

    const basePrice = pricing.pricePerGram - pricing.marginPerGram;
    const finalSellingPrice = basePrice + parseFloat(marginPerGram);

    const inventory = await GoldInventory.findOneAndUpdate(
      { shopkeeperId, isDeleted: false },
      { availableGrams, marginPerGram, finalSellingPrice, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Inventory updated', inventory });
  } catch (err) {
    next(err);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const shopkeeperId = req.user.id;
    const inventory = await GoldInventory.findOne({ shopkeeperId, isDeleted: false });

    if (!inventory) return res.status(404).json({ message: 'No inventory found' });
    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shopkeeperId = req.user.id;

    const inventory = await GoldInventory.findOneAndUpdate(
      { _id: id, shopkeeperId },
      { isDeleted: true, lastUpdated: new Date() },
      { new: true }
    );

    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.status(200).json({ message: 'Inventory soft deleted', inventory });
  } catch (err) {
    next(err);
  }
};
