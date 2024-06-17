import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

import AppError from '../utils/AppError.js';
import { PAGE_SIZE } from '../utils/constants.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // FILTER
  let filter = {};

  const search = req.query.search || null;
  if (search) filter['$text'] = { $search: search };

  // categories
  const categories = req.query.categories;
  // categories = categories.map((category) => category.toLowerCase());
  if (categories && !categories.includes('All')) {
    filter['category'] = { $in: categories };
  }

  // price

  if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined) {
    const minPrice = req.query.minPrice * 1;
    const maxPrice = req.query.maxPrice * 1;
    filter['price'] = {
      $gte: minPrice,
      $lte: maxPrice,
    };
  }

  // status
  const status = req.query.status;
  if (status && status !== 'All') {
    filter['countInStock'] = status === 'In stock' ? { $gte: 1 } : { $lte: 0 };
  }

  // QUERY
  console.log(filter);
  let query = Product.find(filter);

  // PAGINATION
  const page = req.query.page || 1;
  const limit = req.query.limit || PAGE_SIZE;

  query.skip(limit * (page - 1));
  query.limit(limit);

  // WAIT
  const products = await query;

  res.status(200).json({
    status: 'success',

    data: {
      products,
      totalPages: Math.ceil((await Product.countDocuments(filter)) / limit),
    },
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json({ status: 'success', product });
  }

  next(new AppError(404, 'Resource not found'));
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, price, description, image } = req.body;

  const product = new Product({
    user: req.user._id,
    name: name || 'Sample name',
    brand: brand || 'Sample brand',
    category: category || 'Sample category',
    description: description || 'Sample description',
    numReviews: 0,
    price: price || 0,
    countInStock: 0,

    image: image || '/images/sample.jpg',
  });

  const newProduct = await product.save();

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    _id,
    originalCategory,
    name,
    brand,
    category,
    price,
    description,
    countInStock,
  } = req.body;

  const product = await Product.findById(_id);
  if (!product)
    return res.status(404).json({
      status: 'error',
      error: 'Product not found',
    });

  product.originalCategory = originalCategory;
  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price || product.price;
  product.countInStock = countInStock || product.countInStock;

  if (req.file) {
    const ext = req.file.filename.split('.').at(-1);
    product.image = `/uploads/product-${req.file.fieldname}-${_id}.${ext}`;
  }

  const updatedProduct = await product.save();

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct,
    },
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const product = await Product.findById(id);

  if (!product) next(new AppError(404, 'Product not found'));

  await Product.deleteOne({ _id: id });

  res.status(200).json({ status: 'success' });
});

// @desc Get top 3 rating products
// @route GET /api/products/top-3-rating
// @access Public
const getTopRatingProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json({
    status: 'success',
    data: {
      products: topProducts,
    },
  });
});

export {
  getProducts,
  getProductById,
  getTopRatingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
