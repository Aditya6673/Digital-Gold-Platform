import express from 'express';
import { buyGold,getMyTransactions } from '../controllers/transactionController.mjs';
import { protect } from '../middlewares/auth.mjs';
import { buyLimiter } from '../middlewares/rateLimit.mjs';

const router = express.Router();

router.post('/buy', protect, buyLimiter, buyGold);
router.get('/me', protect, getMyTransactions);
export default router;
