import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from '../controllers/review.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireVerification } from '../middleware/verification.middleware.js';

const reviewRoutes = Router();

reviewRoutes.get('/', getAllReviews);
reviewRoutes.get('/:id', getReviewById);
reviewRoutes.post('/', authMiddleware, requireVerification, createReview);
reviewRoutes.put('/:id', authMiddleware, updateReview);

export default reviewRoutes;
