import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { isShopkeeper } from '../middlewares/isShopkeeper.mjs';
import { updateInventory, getInventory, deleteInventory} from '../controllers/shopkeeperController.mjs';
import { shopkeeperLimiter } from '../middlewares/rateLimit.mjs';

const router = express.Router();

router.post('/', protect, isShopkeeper, shopkeeperLimiter, updateInventory);
router.get('/', protect, isShopkeeper, shopkeeperLimiter, getInventory);
router.delete('/:id', protect, isShopkeeper, deleteInventory);

export default router;
