import mongoose from 'mongoose';
const shopkeeperPricingSchema = new mongoose.Schema({
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },
  basePriceId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoldPriceFeed' },
  marginPerGram: Number,
  finalPricePerGram: Number,
  lastUpdated: { type: Date, default: Date.now }
});

const ShopkeeperPricing = mongoose.model('ShopkeeperPricing', shopkeeperPricingSchema);
export default ShopkeeperPricing;