import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// virtual

// query middleware

async function processOrder(order, ProductModel) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.orderItems) {
      const productId = item.product;
      const qty = item.qty;

      // Sử dụng findOneAndUpdate với điều kiện để đảm bảo số lượng sản phẩm không âm
      const product = await ProductModel.findOneAndUpdate(
        { _id: productId, countInStock: { $gte: qty } },
        { $inc: { countInStock: -qty } },
        { new: true, session }
      );

      if (!product) {
        throw new Error(`Not enough stock for product ${productId}`);
      }
    }

    await session.commitTransaction();
    console.log('Số lượng sản phẩm đã được cập nhật thành công.');
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);

    // // Xóa đơn hàng nếu giao dịch không thành công
    // await Order.findByIdAndRemove(order._id);
    throw err;
  }
}

// document middleware
orderSchema.pre('save', async function (next) {
  // this.isNewOrder = this.isNew;
  if (!this.isNew) return;
  // console.log('ĐÂY LÀ ORDER MỚI');
  const ProductModel = this.model('Product');

  const maxRetries = 100;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await processOrder(this, ProductModel);
      break; // Thoát vòng lặp nếu thành công
    } catch (err) {
      if (err.message.includes('Write conflict')) {
        attempt++;
        if (attempt < maxRetries) {
          console.log(`Retrying operation (${attempt}/${maxRetries})...`);
        } else {
          console.error('Max retries reached. Operation failed.');
          throw err;
        }
      } else {
        console.error('Lỗi khác:', err);

        return next(new AppError(422, err.message));
      }
    }
  }
});

// orderSchema.post('save', async function () {
//   if (!this.isNewOrder) return;

// });

// method

// static

const Order = mongoose.model('Order', orderSchema);

export default Order;
