import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // First set up event handlers BEFORE connecting
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', () => {
      console.log("✅ MongoDB connection successful");
    });
    db.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });
    
    // Then connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    // This line will execute only if the connection succeeds
    console.log("✅ MongoDB connection initiated");
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;