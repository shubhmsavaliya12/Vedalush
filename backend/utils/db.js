import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soap_db', {
      dbName: 'soap_db',
    });
    
    isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
