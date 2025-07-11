import mongoose from 'mongoose';

const goldInventorySchema = new mongoose.Schema({
  availableGrams: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0.0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('GoldInventory', goldInventorySchema);