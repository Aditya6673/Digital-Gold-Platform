import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user || req.user.isDeleted) {
        return res.status(401).json({ message: 'Unauthorized - user not found or deleted' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};
