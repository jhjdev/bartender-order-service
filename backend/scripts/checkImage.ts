import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';

async function checkImage(imageId: string) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const imagesCollection = db.collection('images');

    const image = await imagesCollection.findOne({
      _id: new ObjectId(imageId),
    });

    if (image) {
      console.log('Image found:', {
        id: image._id,
        name: image.name,
        contentType: image.contentType,
        dataSize: image.data.buffer.length,
        createdAt: image.createdAt,
      });
    } else {
      console.log('Image not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Get image ID from command line argument
const imageId = process.argv[2];
if (!imageId) {
  console.error('Please provide an image ID');
  process.exit(1);
}

checkImage(imageId);
