import express from 'express';
import {
  setGoldPrice,
  getLatestGoldPrice,
  getGoldPriceHistory
} from '../controllers/goldController.mjs';

import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/', protect, setGoldPrice);
router.get('/latest', getLatestGoldPrice);
router.get('/history', protect, getGoldPriceHistory);

export default router;
