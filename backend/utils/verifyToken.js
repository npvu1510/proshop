import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

// redis
import redisClient from '../config/redis.js';
import AppError from './AppError.js';

const verifyToken = (token, isRefresh) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      !isRefresh ? process.env.SECRET_KEY : process.env.REFRESH_SECRET_KEY,
      async (err, payload) => {
        if (err) {
          reject(err);
        } else {
          // check user exist
          const user = await User.findById(payload._id);
          if (!user) reject(new AppError(401, 'User no longer exists'));

          // Kiểm tra trong db, whitelist, blacklist
          if (isRefresh) {
            const storedToken = await redisClient.get(payload._id);

            if (!storedToken || storedToken.toString() !== token.toString())
              reject(new AppError(401, 'Token is not in the whitelist'));
          }

          resolve(payload);
        }
      }
    );
  });
};

export default verifyToken;
