import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { submitKyc, updateProfile, uploadKycImage } from '../controllers/userController.mjs';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.patch('/kyc', protect, submitKyc); // ✅ KYC submission route
router.put('/profile', protect, updateProfile); // ✅ Profile update route
router.post('/kyc/upload-image', protect, upload.single('image'), uploadKycImage);

export default router;
