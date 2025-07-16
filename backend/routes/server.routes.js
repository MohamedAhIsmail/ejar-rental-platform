import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import reviewRoutes from './review.routes.js';
import Productrouter from './product.routes.js';
import processRouter from './process.routes.js';
import chatRouter from './chat.routes.js';
import messageRouter from './message.routes.js';
import notificationRouter from './notification.routes.js';
import wishlistRoutes from './wishlist.routes.js';

const mainRouter = Router();
mainRouter.use('/product', Productrouter);

mainRouter.use('/wishlist', wishlistRoutes); // /api/wishlist
mainRouter.use('/category', categoryRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/user', userRoutes);
mainRouter.use('/review', reviewRoutes);
mainRouter.use('/process', processRouter);
mainRouter.use('/chat', chatRouter);
mainRouter.use('/message', messageRouter);
mainRouter.use('/notification', notificationRouter);

export default mainRouter;
