import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getEnvPath } from '../utils/paths';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);

async function clearImagesCollection() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    console.log('Using database:', db.databaseName);

    const images = db.collection('images');
    const result = await images.deleteMany({});
    console.log(
      `Cleared ${result.deletedCount} images from the 'images' collection.`
    );
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

clearImagesCollection();
