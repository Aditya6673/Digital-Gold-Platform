import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { submitKyc, updateProfile } from '../controllers/userController.mjs';

const router = express.Router();

router.patch('/kyc', protect, submitKyc); // ✅ KYC submission route
router.put('/profile', protect, updateProfile); // ✅ Profile update route

export default router;
