import mongoose from "mongoose";
import config from "config";

// get the conection string

const db = config.get("mongoURI");

// connect to mongDB

const connectDatabase = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
    });
    console.log("connect to mongoDB");
  } catch (error) {
    console.error(error.message);

    // exit with a fail code
    process.exit(1);
  }
};

export default connectDatabase;
