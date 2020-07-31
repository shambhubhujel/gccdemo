import mongoose from 'mongoose';
import colors from 'colors';

const ConnectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `\tMongoDB connected: ${conn.connection.host}`.brightGreen.underline
  );
};

export default ConnectDB;
