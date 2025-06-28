import express from 'express';
import {
  requestRedemption,
  getMyRedemptionRequests,
  getShopkeeperRedemptionRequests,
  updateRedemptionStatus
} from '../controllers/redemptionController.mjs';

import { protect } from '../middlewares/auth.mjs';
import { isShopkeeper } from '../middlewares/isShopkeeper.mjs';

const router = express.Router();

router.post('/', protect, requestRedemption);
router.get('/me', protect, getMyRedemptionRequests);
router.get('/', protect, isShopkeeper, getShopkeeperRedemptionRequests);
router.put('/:id', protect, isShopkeeper, updateRedemptionStatus);

export default router;
