import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const categoryRoutes = Router();

//create category
categoryRoutes.post('/', authMiddleware, createCategory);

//get all categories
categoryRoutes.get('/', getAllCategories);

//get single category
categoryRoutes.get('/:id', getCategoryById);

//update category
categoryRoutes.put('/:id', authMiddleware, updateCategory);

//delete category
categoryRoutes.delete('/:id', authMiddleware, deleteCategory);

export default categoryRoutes;
