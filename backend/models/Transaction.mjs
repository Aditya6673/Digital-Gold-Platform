import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['buy', 'sell'] },
  grams: Number,
  pricePerGram: Number,
  totalAmount: Number,
  paymentMethod: String,
  paymentId: String,
  status: { type: String, enum: ['success', 'pending', 'failed', 'refunded'] },
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ customerId: 1, status: 1, createdAt: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;