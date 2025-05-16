import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Generate a unique filename for each item
function generateFilename(name: string, id: string): string {
  return `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${id}.jpg`;
}

// Download the image and save it locally
async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      validateStatus: (status) => status < 500, // Accept 4xx for custom handling
    });

    if (response.status === 404) {
      throw new Error('404');
    }

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      (error as { message: string }).message === '404'
    ) {
      throw error;
    }
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

// Main async function
async function main(): Promise<void> {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    // Use the default database from the connection string
    const db = client.db();
    console.log('Using database:', db.databaseName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(
      'Available collections:',
      collections.map((c) => c.name)
    );

    const drinks = db.collection('drinks');
    const cocktails = db.collection('cocktails');

    // Process drinks
    const allDrinks = await drinks.find({}).toArray();
    console.log(`Found ${allDrinks.length} drinks`);
    if (allDrinks.length > 0) {
      console.log('Sample drink:', JSON.stringify(allDrinks[0], null, 2));
    }

    for (const drink of allDrinks) {
      try {
        console.log(`Processing drink: ${drink.name}`);
        if (drink.imageData?.url) {
          const filename = generateFilename(drink.name, drink._id.toString());
          const filepath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filepath)) {
            console.log(
              `Image already exists for ${drink.name}, skipping download.`
            );
            // Always update the DB to ensure the imageUrl is correct
            await drinks.updateOne(
              { _id: new ObjectId(drink._id) },
              { $set: { imageUrl: filepath, 'imageData.source': 'local' } }
            );
            continue;
          }
          let downloaded = false;
          try {
            await downloadImage(drink.imageData.url, filepath);
            downloaded = true;
          } catch (error: unknown) {
            if (
              typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              (error as { message: string }).message === '404'
            ) {
              // Try fallback to Picsum
              const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(
                drink.name
              )}/400/400`;
              try {
                await downloadImage(picsumUrl, filepath);
                downloaded = true;
                console.log(`Used fallback image for ${drink.name}`);
              } catch (fallbackError) {
                console.error(
                  `Both Unsplash and fallback failed for ${drink.name}`
                );
              }
            }
          }
          if (downloaded) {
            // Update database with the local file path
            await drinks.updateOne(
              { _id: new ObjectId(drink._id) },
              { $set: { imageUrl: filepath, 'imageData.source': 'local' } }
            );
            console.log(`Updated drink ${drink.name} with local image`);
          }
        } else {
          console.log(`Skipping ${drink.name}: No image URL`);
        }
      } catch (error) {
        console.error(`Error updating ${drink.name}:`, error);
      }
    }

    // Process cocktails
    const allCocktails = await cocktails.find({}).toArray();
    console.log(`Found ${allCocktails.length} cocktails`);
    if (allCocktails.length > 0) {
      console.log('Sample cocktail:', JSON.stringify(allCocktails[0], null, 2));
    }

    for (const cocktail of allCocktails) {
      try {
        console.log(`Processing cocktail: ${cocktail.name}`);
        if (cocktail.imageData?.url) {
          const filename = generateFilename(
            cocktail.name,
            cocktail._id.toString()
          );
          const filepath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filepath)) {
            console.log(
              `Image already exists for ${cocktail.name}, skipping download.`
            );
            // Always update the DB to ensure the imageUrl is correct
            await cocktails.updateOne(
              { _id: new ObjectId(cocktail._id) },
              { $set: { imageUrl: filepath, 'imageData.source': 'local' } }
            );
            continue;
          }
          let downloaded = false;
          try {
            await downloadImage(cocktail.imageData.url, filepath);
            downloaded = true;
          } catch (error: unknown) {
            if (
              typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              (error as { message: string }).message === '404'
            ) {
              // Try fallback to Picsum
              const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(
                cocktail.name
              )}/400/400`;
              try {
                await downloadImage(picsumUrl, filepath);
                downloaded = true;
                console.log(`Used fallback image for ${cocktail.name}`);
              } catch (fallbackError) {
                console.error(
                  `Both Unsplash and fallback failed for ${cocktail.name}`
                );
              }
            }
          }
          if (downloaded) {
            // Update database with the local file path
            await cocktails.updateOne(
              { _id: new ObjectId(cocktail._id) },
              { $set: { imageUrl: filepath, 'imageData.source': 'local' } }
            );
            console.log(`Updated cocktail ${cocktail.name} with local image`);
          }
        } else {
          console.log(`Skipping ${cocktail.name}: No image URL`);
        }
      } catch (error) {
        console.error(`Error updating ${cocktail.name}:`, error);
      }
    }

    console.log('Successfully downloaded all images');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
