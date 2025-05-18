import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';

async function patchBeerCategories() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const drinks = db.collection('drinks');
    // List of bottled beers
    const bottledBeers = [
      'Corona Extra',
      'Heineken',
      'Duvel',
      'Chimay Blue',
      'Leffe Blonde',
    ];
    // List of draft beers
    const draftBeers = [
      'Pilsner Urquell',
      'Guinness Draught',
      'Sierra Nevada Pale Ale',
      'Stella Artois',
      'Blue Moon',
    ];
    // Update bottled beers
    const bottledResult = await drinks.updateMany(
      { name: { $in: bottledBeers } },
      { $set: { category: 'BOTTLED_BEER' } }
    );
    // Update draft beers
    const draftResult = await drinks.updateMany(
      { name: { $in: draftBeers } },
      { $set: { category: 'DRAFT_BEER' } }
    );
    console.log(
      `Updated ${bottledResult.modifiedCount} beers to category 'BOTTLED_BEER'.`
    );
    console.log(
      `Updated ${draftResult.modifiedCount} beers to category 'DRAFT_BEER'.`
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

patchBeerCategories();
