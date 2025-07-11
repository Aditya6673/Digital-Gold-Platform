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
