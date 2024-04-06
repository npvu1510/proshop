// const notFound = (req, res, next) => {
//   const error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   // If Mongoose not found error, set to 404 and change message
//   if (err.name === 'CastError' && err.kind === 'ObjectId') {
//     statusCode = 404;
//     message = 'Resource not found';
//   }

//   res.status(statusCode).json({
//     message: message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// };

// export { notFound, errorHandler };

const resDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: err.stack,
    // fullError: err,
  });
};
const resProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if ((process.env.NODE_ENV = 'development')) {
    resDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    resProd(res, err);
  }
};

export default errorHandler;
