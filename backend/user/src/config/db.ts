import mongoose from 'mongoose';
import dotenv from 'dotenv';    
dotenv.config();
const connectdb = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(uri,{
            dbName:"Social_app"
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
        throw error;
    }
}

export default connectdb;