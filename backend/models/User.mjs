import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  pan: String,
  aadhar: String,
  panImageUrl: String,
  aadharImageUrl: String,
  verified: { type: Boolean, default: false },
  verificationDate: Date
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true, sparse: true },
  role: { type: String,  default: 'customer' },
  passwordHash: String,
  isDeleted: { type: Boolean, default: false },
  kyc: kycSchema,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);
export default User;
