import User from '../models/User.mjs';
import { logAudit } from '../utils/logAudit.mjs';
import { notifyUser } from '../utils/notifyUser.mjs';

export const getAllUsers = async (req, res, next) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status === 'active') filter.isDeleted = false;
    else if (status === 'deleted') filter.isDeleted = true;
    if (role) filter.role = role;
    const users = await User.find(filter)
      .select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const softDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User soft deleted', user });
    await logAudit({
      action: 'delete_user',
      performedBy: req.user._id,
      targetModel: 'User',
      targetId: user._id,
      changes: { isDeleted: true }
    });
  } catch (err) {
    next(err);
  }
};


export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActiveUsers = await User.countDocuments({ isDeleted: false });
    const totalHoldings = await Holding.countDocuments({ isDeleted: false });

    res.json({
      totalUsers,
      totalActiveUsers,
      totalHoldings
    });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const verifyUserKyc = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.kyc?.verified) {
      return res.status(400).json({ message: 'KYC is already verified' });
    }

    user.kyc.verified = true;
    user.kyc.verifiedAt = new Date();

    await user.save();

    // ✅ Send notification
    await notifyUser(userId, `Your KYC has been verified successfully. You can now buy and redeem gold.`);
    // ✅ Log audit
    await logAudit({
      action: 'verify_kyc',
      performedBy: req.user._id,
      targetModel: 'User',
      targetId: userId,
      changes: { kyc: { verified: true, verifiedAt: new Date() } }
    });

    res.status(200).json({ message: 'KYC verified and user notified.' });
  } catch (err) {
    next(err);
  }
};

