import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';

async function checkBeers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const drinks = db.collection('drinks');

    // Find all beers (draft or bottled)
    const beers = await drinks
      .find({
        category: { $in: ['DRAFT_BEER', 'BOTTLED_BEER'] },
      })
      .toArray();

    if (beers.length === 0) {
      console.log('No beers found in the drinks collection.');
    } else {
      console.log(`Found ${beers.length} beers:`);
      beers.forEach((drink) => {
        console.log({
          name: drink.name,
          category: drink.category,
          price: drink.price,
          imageData: drink.imageData,
        });
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkBeers();
