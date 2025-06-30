import mongoose from 'mongoose';
const goldPriceHistorySchema = new mongoose.Schema({
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },
  pricePerGram: Number,
  source: String,
}, {timestamps: true});

const GoldPriceHistory = mongoose.model('GoldPriceHistory', goldPriceHistorySchema);
export default GoldPriceHistory;