import express from 'express';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
  getTopRatingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../controllers/uploadController.js';

const router = express.Router();

router.route('/top-3-rating').get(getTopRatingProducts);

router
  .route('/')
  .get(getProducts)
  .post(protectRoute, restrictToAdmin, createProduct)
  .patch(protectRoute, restrictToAdmin, upload.single('image'), updateProduct);

router
  .route('/:id')
  .get(protectRoute, getProductById)
  .delete(protectRoute, restrictToAdmin, deleteProduct);

export default router;
