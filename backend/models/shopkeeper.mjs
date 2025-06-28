import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema({
  line: String,
  city: String,
  state: String,
  pincode: String
});

const shopkeeperSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  shopName: String,
  gstNumber: String,
  logoUrl: String,
  isDeleted: { type: Boolean, default: false },
  address: addressSchema,
  status: { type: String, enum: ['active', 'inactive'] },
  createdAt: { type: Date, default: Date.now }
});

const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);
export default Shopkeeper;