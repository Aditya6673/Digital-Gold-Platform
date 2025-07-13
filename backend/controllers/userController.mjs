import User from '../models/User.mjs';

export const submitKyc = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { pan, aadhar, panImageUrl, aadharImageUrl } = req.body;

    if (!pan || !aadhar || !panImageUrl || !aadharImageUrl) {
      return res.status(400).json({ message: 'All KYC fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.kyc.pan = pan;
    user.kyc.aadhar = aadhar;
    user.kyc.panImageUrl = panImageUrl;
    user.kyc.aadharImageUrl = aadharImageUrl;
    user.kyc.verified = false;
    user.kyc.verifiedAt = null;

    await user.save();

    res.status(200).json({ message: 'KYC submitted successfully. Awaiting verification.' });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered with another account' });
    }

    // Check if phone is already taken by another user
    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number is already registered with another account' });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycVerified: user.kyc.verified
      }
    });
  } catch (err) {
    next(err);
  }
};
