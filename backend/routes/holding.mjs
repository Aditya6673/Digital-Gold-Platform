import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import {
  getMyHoldings,
  getHoldingByShopkeeper
} from '../controllers/holdingController.mjs';

const router = express.Router();

router.get('/me', protect, getMyHoldings);
router.get('/:shopkeeperId', protect, getHoldingByShopkeeper);

export default router;
