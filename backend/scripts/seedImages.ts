import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);

async function seedImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    console.log('Using database:', db.databaseName);

    const images = db.collection('images');
    const drinks = db.collection('drinks');
    const cocktails = db.collection('cocktails');

    // Get all images
    const imageDocs = await images.find({}).toArray();
    console.log(`Found ${imageDocs.length} images in the 'images' collection.`);

    // Update drinks with image references
    for (const image of imageDocs) {
      const name = image.name.split('-')[0].replace(/_/g, ' ');
      const result = await drinks.updateOne(
        { name: { $regex: new RegExp(name, 'i') } },
        {
          $set: {
            imageData: {
              _id: image._id,
              url: `/api/images/${image._id}`,
              name: image.name,
            },
          },
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated drink with image: ${image.name}`);
      }
    }

    // Update cocktails with image references
    for (const image of imageDocs) {
      const name = image.name.split('-')[0].replace(/_/g, ' ');
      const result = await cocktails.updateOne(
        { name: { $regex: new RegExp(name, 'i') } },
        {
          $set: {
            imageData: {
              _id: image._id,
              url: `/api/images/${image._id}`,
              name: image.name,
            },
          },
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated cocktail with image: ${image.name}`);
      }
    }

    console.log('Successfully seeded image references in the database.');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

seedImages();
