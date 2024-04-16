import { Router } from 'express';

import {
  signup,
  login,
  logout,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/userController.js';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.post('/logout', logout);

userRouter.use(protectRoute);

userRouter.route('/profile').get(getUserProfile).put(updateUserProfile);

userRouter.get('/', restrictToAdmin, getUsers);
userRouter
  .route('/:id')
  .get(restrictToAdmin, getUserById)
  .patch(restrictToAdmin, updateUser)
  .delete(restrictToAdmin, deleteUser);

export default userRouter;
