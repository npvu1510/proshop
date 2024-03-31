import Product from '../models/productModel.js';

import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    status: 'success',
    data: {
      products,
    },
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) return next(new AppError(404, 'Product not found'));

  return res.status(200).json({ status: 'success', data: { product } });
});
