import { Router } from 'express';
import {
  getUnreadNotifications,
  markAsRead,
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const notificationRouter = Router();

notificationRouter.get('/', authMiddleware, getUnreadNotifications);
notificationRouter.patch('/:notificationId', authMiddleware, markAsRead);

export default notificationRouter;
