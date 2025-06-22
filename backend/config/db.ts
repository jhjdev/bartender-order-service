import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';
import { getEnvPath } from '../utils/paths';
import { initializeIndexes as initializeStaffIndexes } from '../models/Staff';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender-service';

console.log('--- DATABASE CONFIG ---');
console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');
console.log('DB_NAME:', DB_NAME);
console.log('--- END DATABASE CONFIG ---');

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let db: Db;
let client: MongoClient;

export const connectDB = async (): Promise<Db> => {
  try {
    client = await MongoClient.connect(MONGODB_URI, options);
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');

    // Set up indexes for efficient querying
    await setupIndexes();

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const setupIndexes = async () => {
  try {
    // Orders collection indexes
    const ordersCollection = db.collection('orders');

    // Create indexes for common queries
    await ordersCollection.createIndex({ createdAt: -1 });
    await ordersCollection.createIndex({ status: 1 });
    await ordersCollection.createIndex({ paymentStatus: 1 });
    await ordersCollection.createIndex({ staffId: 1 });
    await ordersCollection.createIndex({ tableNumber: 1 });
    await ordersCollection.createIndex({ customerNumber: 1 });
    await ordersCollection.createIndex({ 'items.drinkId': 1 });

    // Compound indexes for complex queries
    await ordersCollection.createIndex({ status: 1, createdAt: -1 });
    await ordersCollection.createIndex({ paymentStatus: 1, createdAt: -1 });
    await ordersCollection.createIndex({ staffId: 1, createdAt: -1 });

    // Text index for customer number search
    await ordersCollection.createIndex({ customerNumber: 'text' });

    // Drinks collection indexes
    const drinksCollection = db.collection('drinks');
    await drinksCollection.createIndex({ name: 1 });
    await drinksCollection.createIndex({ category: 1 });
    await drinksCollection.createIndex({ name: 'text' });

    // Initialize staff indexes
    await initializeStaffIndexes();

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export { db };
