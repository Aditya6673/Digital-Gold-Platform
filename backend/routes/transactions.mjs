import express from 'express';
import { buyGold } from '../controllers/transactionController.mjs';
import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/buy', protect, buyGold);

export default router;
