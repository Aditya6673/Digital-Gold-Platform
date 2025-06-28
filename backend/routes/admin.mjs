import express from 'express';
import {
  getAllUsers,
  getAllShopkeepers,
  softDeleteUser,
  softDeleteShopkeeper
} from '../controllers/adminController.mjs';

import { protect } from '../middlewares/auth.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs'; // create if needed

const router = express.Router();

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.get('/shops', getAllShopkeepers);
router.delete('/users/:id', softDeleteUser);
router.delete('/shops/:id', softDeleteShopkeeper);

export default router;
