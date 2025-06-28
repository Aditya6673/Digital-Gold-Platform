import mongoose from 'mongoose';
const goldPriceFeedSchema = new mongoose.Schema({
  source: String,
  pricePerGram: Number,
  currency: String,
  fetchedAt: { type: Date, default: Date.now }
});

const GoldPriceFeed = mongoose.model('GoldPriceFeed', goldPriceFeedSchema);
export default GoldPriceFeed;