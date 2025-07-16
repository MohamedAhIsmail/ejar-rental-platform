import { Router } from 'express';
import {
  addProduct,
  getAllProducts,
  getOneProduct,
  removeProduct,
  updateProduct,
  upload,
} from '../controllers/product.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validation } from '../middleware/joi.middleware.js';
import { ProductSchema } from '../config/joi.product.validation.js';
import { requireVerification } from '../middleware/verification.middleware.js';

const Productrouter = Router();

Productrouter.post(
  '/',
  authMiddleware,
  requireVerification,
  upload,
  validation(ProductSchema),
  addProduct
);
Productrouter.post('/:id', authMiddleware, upload, updateProduct);
Productrouter.get('/:id', getOneProduct);
Productrouter.get('/', getAllProducts);
Productrouter.delete('/:id', authMiddleware, removeProduct);

export default Productrouter;
