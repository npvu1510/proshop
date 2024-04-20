import asyncHandler from '../middleware/asyncHandler.js';

import Order from '../models/orderModel.js';

import {
  getPaypalToken,
  checkIfNewTransaction,
  verifyPayPalPayment,
} from '../utils/paypal.js';

const testPaypal = asyncHandler(async (req, res, next) => {
  const access_token = await getPaypalToken();

  // const isNew = await isNewTransaction(Order, req.body.id);
  // console.log(isNew);

  const data = await verifyPayPalPayment(access_token, req.body.id);
  console.log(data);

  res.status(200).json({ status: 'success', data: { access_token } });
});

export { testPaypal };
