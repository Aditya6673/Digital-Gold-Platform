import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { submitKyc } from '../controllers/userController.mjs';

const router = express.Router();

router.patch('/kyc', protect, submitKyc); // ✅ KYC submission route

export default router;
