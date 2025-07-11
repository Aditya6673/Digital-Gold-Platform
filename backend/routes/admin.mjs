import express from 'express';
import {
  getAllUsers,
  softDeleteUser,
  getDashboardStats,
  getAuditLogs,
  verifyUserKyc
} from '../controllers/adminController.mjs';

import { protect } from '../middlewares/auth.mjs';
import { isAdmin } from '../middlewares/isAdmin.mjs';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/audit', getAuditLogs());

router.delete('/users/:id', softDeleteUser);
router.patch('/kyc/verify/:userId', protect, isAdmin, verifyUserKyc);
router.delete('/users/:id', softDeleteUser);


export default router;
