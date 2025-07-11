import express from 'express';
import {
  getInventory,
  addGoldToInventory,
  removeGoldFromInventory
} from '../controllers/inventoryController.mjs';
import { protect } from '../middlewares/auth.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';

const router = express.Router();

router.get('/', protect, isAdmin, getInventory);
router.post('/add', protect, isAdmin, addGoldToInventory);
router.post('/remove', protect, isAdmin, removeGoldFromInventory);

export default router;
