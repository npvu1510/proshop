import AppError from '../utils/AppError.js';

const responseInDev = (err, res) => {
  console.log('⚠️⚠️⚠️ ERROR FROM DEVELOPMENT: ');
  // console.log(err.message);
  console.log(err);

  return res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message });
};

const responseInProd = (err, res) => {
  console.log(
    `⚠️⚠️⚠️ ERROR FROM PRODUCTION (${
      err.isOperational ? 'LƯỜNG TRƯỚC' : 'CHƯA LƯỜNG TRƯỚC'
    }): `
  );
  // console.log(err.message);
  console.log(err);

  // Lỗi đã lường trước
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went wrong' });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const mode = process.env.NODE_ENV;

  if (mode === 'development') {
    responseInDev(err, res);
  } else if (mode === 'production') {
    responseInProd(err, res);
  }
};

export default globalErrorHandler;
