import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import AppError from '../utils/AppError.js';

const newReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) next(new AppError(404, 'Product not found'));

  const isAlreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isAlreadyReviewed) next(new AppError(400, 'Already reviewed'));

  //
  const review = {
    product: productId,
    user: req.user._id,
    name: req.body.name,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  product.reviews.unshift(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce(
    (acc, curr) => acc + curr.rating / product.numReviews,
    0
  );

  const updatedProduct = await product.save();

  res
    .status(201)
    .json({ status: 'success', data: { product: updatedProduct, review } });
});

export { newReview };
