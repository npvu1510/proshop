import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

import User from '../models/userModel.js';

// @desc    get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) next(new AppError(404, `User not found`));

  res.status(200).json({
    status: 'success',
    data: { name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
});

// @desc    update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) next(new AppError(400, 'User not found'));

  console.log(user);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;
  console.log(user);

  const updatedUser = await user.save();

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

// @desc    get user list
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users || !users.length === 0) next(new AppError(404, 'Not found'));

  res.status(200).json({ status: 'success', data: { users } });
});

// @desc    get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new AppError(404, 'User not found'));

  res.status(200).json({ status: 'success', data: { user } });
});

// @desc    update user
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  console.log(req.body);

  const user = await User.findById(id);
  if (!user) next(new AppError(404, 'User not found'));

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  user.isAdmin = Boolean(req.body.isAdmin);

  const updatedUser = await user.save();

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

// @desc    delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  console.log('alo');
  await User.deleteOne({ _id: id });

  res.status(200).json({ status: 'success' });
});
