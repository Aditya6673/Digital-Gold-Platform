import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  pan: String,
  aadhar: String,
  verified: Boolean
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['customer', 'shopkeeper'] },
  isDeleted: { type: Boolean, default: false },
  kyc: kycSchema,
  referralCode: String,
  referredBy: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);
export default User;
