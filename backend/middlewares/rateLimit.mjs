import rateLimit from 'express-rate-limit';

// 🚫 1. Limit repeated login attempts
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 login requests
  message: 'Too many login attempts. Please try again after 10 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

// 💳 2. Limit gold buying (per IP or user)
export const buyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many buy attempts in short time. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false
});
// 🏪 3. Limit shopkeeper actions (e.g., setting pricing, approving redemptions)
export const shopkeeperLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many actions performed. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false
});
