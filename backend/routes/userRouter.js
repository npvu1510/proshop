import { Router } from 'express';

import {
  signup,
  login,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
  getUsers,
  logout,
} from '../controllers/userController.js';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.route('/signup').get().post(signup);
userRouter.route('/login').get().post(login);
userRouter.post('/logout', protectRoute, logout);

userRouter.use(protectRoute);

userRouter.route('/profile').get(getUserProfile).put(updateUserProfile);

userRouter.get('/', restrictToAdmin, getUsers);
userRouter
  .route('/:id')
  .get(restrictToAdmin, getUserById)
  .delete(restrictToAdmin, deleteUser);

export default userRouter;
