import multer from 'multer';

import AppError from '../utils/AppError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').at(-1).toLowerCase();
    cb(null, `product-${file.fieldname}-${req.body._id}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);
  else cb(new AppError(400, 'Only accept image/jpeg and image/png'));
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
