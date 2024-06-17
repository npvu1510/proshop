import express from 'express';

import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.post('/logout', logout);

// router.use(protectRoute);
router.get('/refresh', refreshAccessToken);

export default router;
