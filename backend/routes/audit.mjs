import express from 'express';
import { protect,isAdmin } from '../middlewares/auth.mjs';
import { getAuditLogs } from '../controllers/adminController.mjs';
import {getAuditLogs} from '../controllers/auditController.mjs';

const router = express.Router();

router.use(protect);
router.use(isAdmin);
router.get('/', getAuditLogs);

export default router;
