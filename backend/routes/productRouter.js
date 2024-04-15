import express from 'express';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protectRoute, restrictToAdmin, createProduct)
  .patch(protectRoute, restrictToAdmin, updateProduct);

router.route('/:id').get(getProductById);

export default router;
