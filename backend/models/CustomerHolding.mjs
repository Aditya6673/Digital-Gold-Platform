import mongoose from 'mongoose';
const customerHoldingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalGrams: Number,
  averagePricePerGram: Number,
  totalInvested: Number,
  isDeleted: { type: Boolean, default: false },
  lastTransactionAt: Date
});

const CustomerHolding = mongoose.model('CustomerHolding', customerHoldingSchema);
export default CustomerHolding;