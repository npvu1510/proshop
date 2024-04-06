import jwt from 'jsonwebtoken';

import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) throw new Error('Not authorized, no token provided');

  const payload = jwt.verify(token, process.env.SECRET_KEY);
  if (!payload) throw new Error('Not authorized, token is invalid');

  req.user = await User.findById(payload._id).select('-password');

  next();
});

export const restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({ error: 'Not authorized (only for admin)' });
  }
  next();
};
