import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { getEnvPath, getUploadsPath } from '../utils/paths';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);
const UPLOADS_DIR = getUploadsPath();

async function uploadImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    console.log('Using database:', db.databaseName);

    const images = db.collection('images');
    const files = fs.readdirSync(UPLOADS_DIR);
    for (const file of files) {
      if (file.endsWith('.jpg')) {
        const filepath = path.join(UPLOADS_DIR, file);
        const imageData = fs.readFileSync(filepath);
        const imageId = new ObjectId();
        await images.insertOne({
          _id: imageId,
          name: file,
          data: imageData,
          contentType: 'image/jpeg',
        });
        console.log(`Uploaded image: ${file}`);
      }
    }
    console.log('Successfully uploaded all images to MongoDB.');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

uploadImages();
