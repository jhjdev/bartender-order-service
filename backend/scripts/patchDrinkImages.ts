import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';

async function patchDrinkImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const drinks = db.collection('drinks');
    // Patch Provence Rosé
    const provRes = await drinks.updateOne(
      { name: 'Provence Rosé' },
      {
        $set: {
          imageData: {
            _id: '6827dd4a3877d114e326de25',
            url: '/api/images/6827dd4a3877d114e326de25',
            name: 'provence_ros_-6827cdfd6902b40dc93b6ad9.jpg',
          },
        },
      }
    );
    // Patch Hendrick's Gin
    const hendRes = await drinks.updateOne(
      { name: "Hendrick's Gin" },
      {
        $set: {
          imageData: {
            _id: '6827dd493877d114e326de1a',
            url: '/api/images/6827dd493877d114e326de1a',
            name: 'hendrick_s_gin-6827cdfd6902b40dc93b6ade.jpg',
          },
        },
      }
    );
    console.log(
      `Patched Provence Rosé: matched ${provRes.matchedCount}, modified ${provRes.modifiedCount}`
    );
    console.log(
      `Patched Hendrick's Gin: matched ${hendRes.matchedCount}, modified ${hendRes.modifiedCount}`
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

patchDrinkImages();
