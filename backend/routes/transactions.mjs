import express from 'express';
import { buyGold,getMyTransactions } from '../controllers/transactionController.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/buy', protect, buyGold);
router.get('/me', protect, getMyTransactions);
export default router;
