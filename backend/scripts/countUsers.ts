import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getEnvPath } from '../utils/paths';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);

async function countUsers() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    console.log('Using database:', db.databaseName);

    const admins = db.collection('admins');
    const count = await admins.countDocuments();
    console.log(`Number of users in the 'admins' collection: ${count}`);
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

countUsers();
