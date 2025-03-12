import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error in connection to db: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;