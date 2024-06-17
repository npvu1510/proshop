import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

// utils
import AppError from './utils/AppError.js';
import globalErrorHandler from './controllers/errorController.js';

import { protectRoute } from './middleware/authMiddleware.js';

import authRouter from './routes/authRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import categoryRouter from './routes/categoryRouter.js';
// import uploadRouter from './routes/uploadRouter.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// cors
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// log
app.use(morgan('dev'));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

console.log(process.env.NODE_ENV);

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);

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
app.use(globalErrorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
