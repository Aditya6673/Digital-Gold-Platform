import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import {
  getMyHoldings
} from '../controllers/holdingController.mjs';

const router = express.Router();

router.get('/me', protect, getMyHoldings);

export default router;
