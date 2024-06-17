import User from '../models/userModel.js';

// utils
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import signToken from '../utils/signToken.js';
import verifyToken from '../utils/verifyToken.js';

// redis
import redisClient from '../config/redis.js';

// @desc    register
// @route   GET /api/users/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return next(new AppError(400, 'User already exists'));
  }

  const user = await User.create({ name, email, password });

  signToken(res, { _id: user._id });
  signToken(res, { _id: user._id }, true);

  return res.status(200).json({
    status: 'success',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// @desc    auth user and provide jwt
// @route   GET /api/users/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'));
  }

  const user = await User.findOne({ email });
  if (!user) return next(new AppError(401, `Account does not exist `));

  if (!(await user.checkPassword(password)))
    return next(new AppError(401, `Password is wrong`));

  // sign token
  signToken(res, { _id: user._id });
  signToken(res, { _id: user._id }, true);

  return res.status(200).json({
    status: 'success',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// @desc    logout
// @route   POST /api/users/logout
// @access  Public
export const logout = (req, res, next) => {
  return res
    .cookie('jwt', '', { maxAge: 1 })
    .status(200)
    .json({ status: 'success', message: 'User logged out' });
};

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return next(
      new AppError(400, 'Your login session expired. Please login again !')
    );

  // Valid check refresh token
  const payload = await verifyToken(refreshToken, true);

  // Sign new access token
  signToken(res, { _id: payload._id });

  // setTimeout(() => {
  //   return res.status(200).json({ status: 'success' });
  // }, 3000);
  return res.status(200).json({ status: 'success' });
});
