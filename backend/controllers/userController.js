import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

import User from '../models/userModel.js';

import generateToken from '../utils/generateToken.js';

// @desc    register
// @route   GET /api/users/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    throw new AppError(400, 'User already exists');
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(res, { _id: user._id });

  res.status(201).json({ message: 'success', data: { token } });
});

// @desc    auth user and provide jwt
// @route   GET /api/users/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, `Account does not exist `);

  if (!(await user.checkPassword(password)))
    // throw new Error(`Password is wrong`);
    throw new AppError(401, `Password is wrong`);

  const token = generateToken(res, { _id: user._id });
  res.status(200).json({ status: 'success', data: { token } });
});

// @desc    get user profile
// @route   GET /api/users/profile
// @access  Private
export const logout = (req, res) => {
  res
    .cookie('jwt', '', { maxAge: 1 })
    .status(200)
    .json({ status: 'success', message: 'User logged out' });
};

// @desc    get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError(404, `User not found`);

  res.status(200).json({
    status: 'success',
    data: { name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
});

// @desc    update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) new AppError(400, 'User not found');

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;

  const updatedUser = await user.save();

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

// @desc    get user list
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users || !users.length === 0) throw new AppError(404, 'Not found');

  res.status(200).json({ status: 'success', data: { users } });
});

// @desc    get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError(404, 'User not found');

  res.status(200).json({ status: 'success', data: { user } });
});

// @desc    update user
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler((req, res) => {
  res.send('updateUser');
});

// @desc    delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler((req, res) => {
  res.send('deleteUser');
});
