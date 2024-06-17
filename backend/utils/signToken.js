import jwt from 'jsonwebtoken';

import redisClient from '../config/redis.js';

const signToken = (res, payload, isRefresh = false) => {
  const token = jwt.sign(
    payload,
    !isRefresh ? process.env.SECRET_KEY : process.env.REFRESH_SECRET_KEY,
    { expiresIn: !isRefresh ? '3s' : '7d' }
  );

  res.cookie(!isRefresh ? 'jwt' : 'refreshToken', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // redis
  if (isRefresh)
    redisClient.set(`${payload._id}`, token, 'EX', 7 * 24 * 60 * 60);

  return token;
};

export default signToken;
