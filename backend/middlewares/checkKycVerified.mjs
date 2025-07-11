import User from '../models/User.mjs';

export const checkKycVerified = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID missing' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.kyc?.verified) {
      return res.status(403).json({ success: false, message: 'KYC not verified. Access denied.' });
    }

    next();
  } catch (err) {
    console.error('KYC Middleware Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error (KYC check)' });
  }
};
