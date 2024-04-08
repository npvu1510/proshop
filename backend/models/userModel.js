import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,

      validate: [validator.isEmail, 'Email has invalid format'],
    },
    password: {
      type: String,
      required: true,

      minLength: [3, 'Password must be at least 3 characters'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema middleware
userSchema.pre('save', async function (next) {
  // console.log(this);

  if (!this.isModified('password')) {
    console.log('Không đổi mật khẩu');
    return next();
  }

  console.log('Đã đổi mật khẩu');

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);

  // console.log(this.password);
  next();
});

// userSchema.pre('save', async function (next) {
//   console.log('FROM 2', this.password);

//   next();
// });

// static methods

// methods
userSchema.methods.checkPassword = async function (password) {
  // console.log(password, this.password)
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
