import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    categories,
  });
});
