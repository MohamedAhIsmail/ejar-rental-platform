import { Router } from 'express';
import Message from '../controllers/message.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const messageRouter = Router();

messageRouter.post('/', authMiddleware, Message.createMessage);
messageRouter.get('/:chatId', authMiddleware, Message.getChatMessages);

export default messageRouter;
