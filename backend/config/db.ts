import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const options: MongoClientOptions = {
  // Add any specific MongoDB options here
  connectTimeoutMS: 10000,  // 10 seconds
  socketTimeoutMS: 45000,   // 45 seconds
};

export const client = new MongoClient(MONGODB_URI, options);

export const connectDB = async (): Promise<void> => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await client.connect();
      
      // Test the connection
      await client.db().command({ ping: 1 });
      console.log('Successfully connected to MongoDB');
      
      // Add connection error handler
      client.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      // Add connection close handler
      client.on('close', () => {
        console.warn('MongoDB connection closed');
      });

      return;
    } catch (error) {
      console.error(`Failed to connect to MongoDB (attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      retries++;
      
      if (retries === MAX_RETRIES) {
        throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB connection closure:', error);
    process.exit(1);
  }
});

export const db = client.db();

export default connectDB;
