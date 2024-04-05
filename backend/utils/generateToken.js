import jwt from 'jsonwebtoken';

const generateToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3d' });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};

export default generateToken;
