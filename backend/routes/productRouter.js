import express from 'express';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import upload from '../controllers/uploadController.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protectRoute, restrictToAdmin, createProduct)
  .patch(protectRoute, restrictToAdmin, upload.single('image'), updateProduct);

router.route('/:id').get(getProductById);

export default router;
