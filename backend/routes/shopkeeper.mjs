import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { isShopkeeper } from '../middlewares/isShopkeeper.mjs';
import {
  updateInventory,
  getInventory,
  deleteInventory
} from '../controllers/shopkeeperController.mjs';

const router = express.Router();

router.post('/', protect, isShopkeeper, updateInventory);
router.get('/', protect, isShopkeeper, getInventory);
router.delete('/:id', protect, isShopkeeper, deleteInventory);

export default router;
