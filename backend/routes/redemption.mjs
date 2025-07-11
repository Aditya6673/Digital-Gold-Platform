import express from 'express';
import {
  requestRedemption,
  getMyRedemptionRequests,
  updateRedemptionStatus
} from '../controllers/redemptionController.mjs';

import { protect } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/', protect, requestRedemption);
router.get('/me', protect, getMyRedemptionRequests);
router.get('/', protect, isShopkeeper, getShopkeeperRedemptionRequests);
router.put('/:id', protect, isShopkeeper, updateRedemptionStatus);

export default router;
