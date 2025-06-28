import mongoose from 'mongoose';
const goldPriceHistorySchema = new mongoose.Schema({
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },
  pricePerGram: Number,
  source: String,
  timestamp: { type: Date, default: Date.now }
});

const GoldPriceHistory = mongoose.model('GoldPriceHistory', goldPriceHistorySchema);
export default GoldPriceHistory;