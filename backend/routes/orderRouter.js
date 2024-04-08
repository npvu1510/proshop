import express from 'express';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.use(protectRoute);

orderRouter.route('/').get(restrictToAdmin, getOrders).post(createOrder);
orderRouter.route('/:id').get(getOrderById);
orderRouter.route('/:id/pay').patch(updateOrderToPaid);
orderRouter
  .route('/:id/deliver')
  .patch(restrictToAdmin, updateOrderToDelivered);
orderRouter.route('/my-orders').get(getMyOrders);

export default orderRouter;
