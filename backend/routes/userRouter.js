import { Router } from 'express';

import {
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
  getUsers,
  updateUser,
} from '../controllers/userController.js';

import { protectRoute, restrictToAdmin } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.route('/profile').get(getUserProfile).put(updateUserProfile);

userRouter.get('/', restrictToAdmin, getUsers);
userRouter
  .route('/:id')
  .get(restrictToAdmin, getUserById)
  .patch(restrictToAdmin, updateUser)
  .delete(restrictToAdmin, deleteUser);

export default userRouter;
