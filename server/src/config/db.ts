import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if(!process.env.MONGO_URL) throw new Error("MONGO_URL is not defined");
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;