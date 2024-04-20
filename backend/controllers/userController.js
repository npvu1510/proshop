import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

import User from '../models/userModel.js';

import generateToken from '../utils/generateToken.js';

// @desc    register
// @route   GET /api/users/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    next(new AppError(400, 'User already exists'));
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(res, { _id: user._id });

  res.status(200).json({
    status: 'success',
    data: {
      userInfo: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: token,
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
    next(new AppError(400, 'Please provide email and password'));
  }

  const user = await User.findOne({ email });
  if (!user) next(new AppError(401, `Account does not exist `));

  if (!(await user.checkPassword(password)))
    // next(new Error(`Password is wrong`);
    next(new AppError(401, `Password is wrong`));

  const token = generateToken(res, { _id: user._id });
  res.status(200).json({
    status: 'success',
    data: {
      userInfo: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: token,
    },
  });
});

// @desc    logout
// @route   POST /api/users/logout
// @access  Public
export const logout = (req, res, next) => {
  res
    .cookie('jwt', '', { maxAge: 1 })
    .status(200)
    .json({ status: 'success', message: 'User logged out' });
};

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

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;

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
