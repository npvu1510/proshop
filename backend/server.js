import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
import connectDB from './config/db.js';

import AppError from './utils/AppError.js';
import errorHandler from './middleware/errorMiddleware.js';

import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.all('*', (req, res, next) => {
  console.log('hi');
  next(new AppError(404, `${req.originalUrl} not found on server`));
});
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
