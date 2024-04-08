import Order from '../models/orderModel.js';

import AppError from '../utils/AppError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create a new Order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  console.log(req.body);

  if (!orderItems || orderItems.length === 0)
    throw new AppError(400, 'Order items is empty');

  const order = new Order({
    user: req.user._id,
    orderItems: orderItems.map((item) => {
      return { ...item, product: item._id };
    }),
    shippingAddress,
    paymentMethod,

    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });
  const savedOrder = await order.save();

  res.status(201).json({ status: 'success', data: { newOrder: savedOrder } });
});

// @desc    Get all orders of logged in user
// @route   POST /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders || orders.length === 0)
    throw new AppError(404, 'Orders not found');

  res.status(200).json({ status: 'success', data: { orders } });
});

// @desc    Get order by id
// @route   POST /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) throw new AppError(404, 'Orders not found');

  res.status(200).json({ status: 'success', data: { order } });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (!orders || orders.length === 0)
    throw new AppError(404, 'Orders not found');

  res.status(200).json({ status: 'success', data: { orders } });
});

// @desc    Update order to paid
// @route   PATCH /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  // res.send('update order to paid');
  const order = await Order.findById(req.params.id);

  console.log(req.body);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
  }

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', updatedOrder });
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send('updateOrderToDelivered');
});
