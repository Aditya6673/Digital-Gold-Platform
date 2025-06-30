import express from 'express';
import { register, login, getMe, logout, refreshToken } from '../controllers/authController.mjs';
import { protect } from '../middlewares/auth.mjs';
import cookieParser from 'cookie-parser';
import { loginLimiter } from '../middlewares/rateLimit.mjs';

const router = express.Router();
router.use(cookieParser());

router.post('/register', register);
router.post('/login', loginLimiter,login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;