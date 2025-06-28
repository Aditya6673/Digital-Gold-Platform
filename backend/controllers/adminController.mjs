import User from '../models/User.mjs';
import Shopkeeper from '../models/shopkeeper.mjs';

export const getAllUsers = async (req, res, next) => {
  try {
    const { status } = req.query; // e.g., ?status=deleted or ?status=active

    let filter = {};
    if (status === 'active') filter.isDeleted = false;
    else if (status === 'deleted') filter.isDeleted = true;

    const users = await User.find(filter).select('-passwordHash');
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
  } catch (err) {
    next(err);
  }
};
