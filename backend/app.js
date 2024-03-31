import express from 'express';

import productRouter from './routes/productRouter.js';

import AppError from './utils/AppError.js';
import errorHandler from './controllers/errorController.js';

const app = express();

console.log(x);

app.use('/api', productRouter);

app.get('/', (req, res) => {
  res.send(`<p>Hello World</p>`);
});

// Error handle
app.use('*', (req, res, next) => {
  const notFoundError = new AppError(504, `${req.originalUrl} not found !`);

  next(notFoundError);
});

app.use(errorHandler);

export default app;
