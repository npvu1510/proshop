import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    originalCategory: { type: String, select: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      index: 'text',
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Count in stock must be at least 0'],
    },
  },
  {
    timestamps: true,
  }
);

// virtuals

// document middlewares
productSchema.pre('save', async function (next) {
  if (!this.isModified('category')) {
    console.log(`${this.name} không đổi category`);
    return next();
  }

  const CategoryModel = this.model('Category');

  const oldCategory = await CategoryModel.findOne({
    name: this.originalCategory,
  });

  const newCategoryName = this.category;
  const oldCategoryName = oldCategory ? oldCategory.name : undefined;

  console.log(`${this.name} thay đổi category`);
  console.log('New Category:', newCategoryName);
  console.log('Old Category:', oldCategoryName);

  try {
    // Tăng số lượng sản phẩm trong danh mục mới
    await CategoryModel.findOneAndUpdate(
      { name: newCategoryName },
      { $inc: { productQuantity: 1 } },
      { new: true, upsert: true }
    );

    // Giảm số lượng sản phẩm trong danh mục cũ
    if (oldCategoryName) {
      await CategoryModel.findOneAndUpdate(
        { name: oldCategoryName },
        { $inc: { productQuantity: -1 } },
        { new: true }
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

// query middlewares

// methods

// static methods

const Product = mongoose.model('Product', productSchema);

export default Product;
