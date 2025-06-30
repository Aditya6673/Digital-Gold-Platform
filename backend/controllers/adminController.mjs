import User from '../models/User.mjs';
import Shopkeeper from '../models/shopkeeper.mjs';
import { logAudit } from '../utils/logAudit.mjs';

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


export const getAllShopkeepers = async (req, res, next) => {
  try {
    const shopkeepers = await Shopkeeper.find({ isDeleted: false }).populate('userId', '-passwordHash');
    res.status(200).json(shopkeepers);
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

export const softDeleteShopkeeper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await Shopkeeper.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!shop) return res.status(404).json({ message: 'Shopkeeper not found' });
    res.status(200).json({ message: 'Shopkeeper soft deleted', shop });
    await logAudit({
      action: 'delete_shopkeeper',
      performedBy: req.user._id,
      targetModel: 'Shopkeeper',
      targetId: shop._id,
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
    const totalShopkeepers = await Shopkeeper.countDocuments({ isDeleted: false });
    const totalHoldings = await Holding.countDocuments({ isDeleted: false });

    res.json({
      totalUsers,
      totalActiveUsers,
      totalShopkeepers,
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
