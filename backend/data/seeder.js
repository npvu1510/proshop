import mongoose from 'mongoose';
import dotenv from 'dotenv';

import colors from 'colors';

import connectDB from '../config/db.js';

import users from './users.js';
import products from './products.js';

import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

dotenv.config({ path: '.env' });
connectDB();

const importData = async () => {
  try {
    // clear data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // import data
    const res = await User.insertMany(users);
    const admin = res.at(0)._id;

    const productsWithAdmin = products.map((product) => {
      return { ...product, user: admin };
    });
    await Product.insertMany(productsWithAdmin);

    console.log('Data imported !'.green);
    process.exit(0);
  } catch (err) {
    console.log(err.message.red);
    process.exit(1);
  }
};

const destoyData = async () => {
  try {
    // clear data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed !'.green);
    process.exit(0);
  } catch (err) {
    console.log(err.message.red);
    process.exit(1);
  }
};

// console.log(process.argv[2]);

if (process.argv[2] === 'import') importData();
else if (process.argv[2] === 'destroy') destoyData();
