import AppError from '../utils/AppError.js';

const resErrorDev = (res, error) => {
  console.error(`⚠️ ERROR WHILE DEVELOPING`, error);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const resErrorProd = (res, error) => {
  if (error.isHandledError) {
    console.error(`⚠️ HANDLED ERROR WHILE PRODUCING`, error);

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.log(`⚠️ UNHANDLED ERROR WHILE PRODUCING`, error);
    res.status(500).json({ error: 'Something went wrong (error from server)' });
  }
};

const handleCastError = (err) => {
  const message = `The ${err.path} is in wrong format, should be ${err.kind} instead of ${err.valueType} (${err.value})`;
  return new AppError(400, message);
};

const errorHandler = (err, req, res, next) => {
  // console.log('⚠️⚠️⚠️ ERROR HANDLER');

  err.statusCode = err.statusCode || 500;
  err.status = err.staus || 'error';

  const node_env = process.env.NODE_ENV;
  if (node_env === 'development') resErrorDev(res, err);
  else {
    let handledErr = err;

    if (err.name === 'CastError') handledErr = handleCastError(err);

    resErrorProd(res, handledErr);
  }
};

export default errorHandler;
