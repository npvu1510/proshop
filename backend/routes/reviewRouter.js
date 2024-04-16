import express from 'express';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';

import { newReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter
  .route('/:productId')
  .get()
  .post(
    (req, res, next) => {
      console.log('here');
      next();
    },
    protectRoute,
    newReview
  );

export default reviewRouter;
