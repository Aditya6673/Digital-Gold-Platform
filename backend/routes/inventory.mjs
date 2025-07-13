import express from 'express';
import {
  getInventory,
  updateInventory
} from '../controllers/inventoryController.mjs';
import { protect } from '../middlewares/auth.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';

const router = express.Router();

router.get('/', protect, isAdmin, getInventory);
router.post('/update', protect, isAdmin, updateInventory);

export default router;
