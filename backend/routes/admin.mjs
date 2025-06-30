import express from 'express';
import {
  getAllUsers,
  getAllShopkeepers,
  softDeleteUser,
  softDeleteShopkeeper,
  getDashboardStats,
  getAuditLogs
} from '../controllers/adminController.mjs';

import { protect } from '../middlewares/auth.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs'; // create if needed

const router = express.Router();

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.get('/shops', getAllShopkeepers);
router.get('/stats', getDashboardStats);
router.get('/audit', getAuditLogs);

router.delete('/users/:id', softDeleteUser);
router.delete('/shops/:id', softDeleteShopkeeper);

export default router;
