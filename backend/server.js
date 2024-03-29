import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import connectDB from './config/db.js';
connectDB();

import app from './app.js';
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is runnit on port ${port}...`);
});
