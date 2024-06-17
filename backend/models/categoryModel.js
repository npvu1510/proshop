import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category name must be provided'],
      unique: true,
      trim: true,
    },

    productQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
