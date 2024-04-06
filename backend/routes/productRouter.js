import express from 'express';

import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';

router.route('/').get(protectRoute, getProducts);
router.route('/:id').get(getProductById);

export default router;
