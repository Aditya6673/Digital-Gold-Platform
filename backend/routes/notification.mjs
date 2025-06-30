import express from 'express';
import { protect } from '../middlewares/auth.mjs';
import { getMyNotifications, markAsRead } from '../controllers/notificationController.mjs';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);

export default router;
