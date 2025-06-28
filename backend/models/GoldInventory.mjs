import mongoose from 'mongoose';
const goldInventorySchema = new mongoose.Schema({
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },
  availableGrams: Number,
  marginPerGram: Number,
  finalSellingPrice: Number,
  isDeleted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

const GoldInventory = mongoose.model('GoldInventory', goldInventorySchema);
export default GoldInventory;
