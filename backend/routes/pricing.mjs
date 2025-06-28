import express from 'express';
import { setShopkeeperPricing, getShopkeeperPricing } from '../controllers/pricingController.mjs';
import { protect } from '../middlewares/auth.mjs';
import { isShopkeeper } from '../middlewares/isShopkeeper.mjs';

const router = express.Router();

router.use(protect, isShopkeeper);

router.post('/', setShopkeeperPricing);
router.get('/', getShopkeeperPricing);

export default router;
