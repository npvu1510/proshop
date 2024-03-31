import mongoose from 'mongoose';

const connectDB = async () => {
  // try {
  //   const conn = await mongoose.connect(process.env.MONGO_URI);
  //   console.log(`Connected to database at ${conn.connection.host}`);
  // } catch (err) {
  //   // console.log(err.name, err.message);
  //   console.log('caught by try-catch block');
  // }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to database at ${conn.connection.host}`);
};

export default connectDB;
