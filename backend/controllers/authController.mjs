import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      createdAt: new Date()
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({ user: { id: user._id, name: user.name, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id, isDeleted: false }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


