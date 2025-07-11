import express from 'express';
import { buyGold,getMyTransactions } from '../controllers/transactionController.mjs';
import { protect } from '../middlewares/auth.mjs';
import { buyLimiter } from '../middlewares/rateLimit.mjs';
import { checkKycVerified } from '../middlewares/checkKycVerified.mjs';

const router = express.Router();

router.post('/buy', protect, buyLimiter, checkKycVerified, buyGold);
router.get('/me', protect, checkKycVerified, getMyTransactions);
export default router;
