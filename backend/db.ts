import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender';

let client: MongoClient;

export const connectToDatabase = async () => {
  try {
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return client.db(DB_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!client) {
    throw new Error('Database not connected');
  }
  return client.db(DB_NAME);
};
