import express from 'express';

import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;
