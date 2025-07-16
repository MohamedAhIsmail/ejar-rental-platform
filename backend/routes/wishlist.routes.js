import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';

const wishlistRoutes = Router();

wishlistRoutes.get('/', authMiddleware, getWishlist);
wishlistRoutes.post('/add/:productId', authMiddleware, addToWishlist);
wishlistRoutes.delete('/remove/:productId', authMiddleware, removeFromWishlist);
wishlistRoutes.delete('/clear', authMiddleware, clearWishlist);

export default wishlistRoutes;
