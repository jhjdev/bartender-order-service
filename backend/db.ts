import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender-order-service';

let client: MongoClient;

export const connectToDatabase = async () => {
  try {
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!client) {
    throw new Error('Database not connected');
  }
  return client.db(DB_NAME);
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
};
