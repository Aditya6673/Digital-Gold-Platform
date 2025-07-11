import mongoose from 'mongoose';
const redemptionRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gramsRequested: Number,
  mode: { type: String, enum: ['pickup', 'delivery'] },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'] },
  requestedAt: { type: Date, default: Date.now },
  fulfilledAt: Date,
  isDeleted: { type: Boolean, default: false },
  notes: String
});

const RedemptionRequest = mongoose.model('RedemptionRequest', redemptionRequestSchema);
export default RedemptionRequest;