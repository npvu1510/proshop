import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
console.log(process.env.NODE_ENV);

import connectDB from './config/db.js';
connectDB();

import app from './app.js';
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
  console.log(`Server is runnit on port ${port}...`);
});

process.on('uncaughtException', (err) => {
  console.log(
    `🧨 UNCAUGHT EXCEPTION (${err.name} ${err.message}). Server is shutting down... `
  );
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (err) => {
  console.log(
    `🧨 UNHANDLED REJECTION (${err.name} ${err.message}). Server is shutting down... `
  );

  // Graceful shutdown
  process.exit(1);
});
