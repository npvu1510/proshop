import jwt from 'jsonwebtoken';

import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

import AppError from '../utils/AppError.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) next(new AppError(401, 'Not authorized, no token provided'));

  const payload = jwt.verify(token, process.env.SECRET_KEY);
  if (!payload) next(new AppError(401, 'Not authorized, token is invalid'));

  req.user = await User.findById(payload._id).select('-password');

  next();
});

export const restrictToAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    next(new AppError(401, 'Not authorized, only for admin'));
  }
  next();
};
