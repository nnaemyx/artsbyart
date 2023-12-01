import mongoose from "mongoose";

const connectDb = () => {
    if (mongoose.connections[0].readyState) {
      return;
    }
    mongoose.connect(
      process.env.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
};


export default connectDb