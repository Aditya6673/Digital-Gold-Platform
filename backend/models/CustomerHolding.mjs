import mongoose from 'mongoose';
const customerHoldingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },
  totalGrams: Number,
  averagePricePerGram: Number,
  totalInvested: Number,
  isDeleted: { type: Boolean, default: false },
  lastTransactionAt: Date
});

customerHoldingSchema.index({ customerId: 1, shopkeeperId: 1 });

const CustomerHolding = mongoose.model('CustomerHolding', customerHoldingSchema);
export default CustomerHolding;