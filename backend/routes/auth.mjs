import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
