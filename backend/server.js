import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

import AppError from './utils/AppError.js';
import errorHandler from './middleware/errorMiddleware.js';

import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import { protectRoute } from './middleware/authMiddleware.js';
// import uploadRouter from './routes/uploadRouter.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

console.log(process.env.NODE_ENV);

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);
// app.use('/api/uploads', uploadRouter);
app.use('/api/paypal-client-id', protectRoute, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { clientId: process.env.PAYPAL_CLIENT_ID },
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.all('*', (req, res, next) => {
  // console.log('hi');
  next(new AppError(404, `${req.originalUrl} not found on server`));
});
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
