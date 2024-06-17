import express from 'express';

import { protectRoute } from '../middleware/authMiddleware.js';

import { newReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.route('/:productId').get().post(protectRoute, newReview);

export default reviewRouter;
