import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Constants
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:4000/bartender';
console.log('Using MongoDB URI:', MONGODB_URI);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY is not set in environment variables');
  process.exit(1);
}

// Generate a unique filename for each item
function generateFilename(name: string, id: string): string {
  return `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${id}.jpg`;
}

// Define the PexelsPhoto interface
interface PexelsPhoto {
  url: string;
  src: {
    medium: string;
  };
  description?: string;
  alt?: string;
}

// Minimal Drink type for this script
interface Drink {
  name: string;
  category: string;
}

// Helper to get drink type and fallback
function getDrinkTypeAndFallback(drink: Drink): {
  search: string;
  fallback: string;
} {
  const name = drink.name.toLowerCase();
  if (drink.category === 'BEER') {
    if (name.includes('stout'))
      return {
        search: 'beer stout bottle ' + drink.name,
        fallback: 'beer stout bottle',
      };
    if (name.includes('lager'))
      return {
        search: 'beer lager bottle ' + drink.name,
        fallback: 'beer lager bottle',
      };
    if (name.includes('ale'))
      return {
        search: 'beer ale bottle ' + drink.name,
        fallback: 'beer ale bottle',
      };
    return { search: 'beer bottle ' + drink.name, fallback: 'beer bottle' };
  }
  if (drink.category === 'WINE') {
    if (name.includes('red'))
      return {
        search: 'red wine bottle ' + drink.name,
        fallback: 'red wine bottle',
      };
    if (name.includes('white'))
      return {
        search: 'white wine bottle ' + drink.name,
        fallback: 'white wine bottle',
      };
    if (name.includes('ros'))
      return {
        search: 'rose wine bottle ' + drink.name,
        fallback: 'rose wine bottle',
      };
    return { search: 'wine bottle ' + drink.name, fallback: 'wine bottle' };
  }
  if (drink.category === 'SPIRIT') {
    if (name.includes('vodka'))
      return {
        search: 'spirit vodka bottle ' + drink.name,
        fallback: 'vodka bottle',
      };
    if (name.includes('gin'))
      return {
        search: 'spirit gin bottle ' + drink.name,
        fallback: 'gin bottle',
      };
    if (name.includes('whisky') || name.includes('whiskey'))
      return {
        search: 'spirit whisky bottle ' + drink.name,
        fallback: 'whisky bottle',
      };
    if (name.includes('tequila'))
      return {
        search: 'spirit tequila bottle ' + drink.name,
        fallback: 'tequila bottle',
      };
    if (name.includes('bourbon'))
      return {
        search: 'spirit bourbon bottle ' + drink.name,
        fallback: 'bourbon bottle',
      };
    return { search: 'spirit bottle ' + drink.name, fallback: 'spirit bottle' };
  }
  if (drink.category === 'COCKTAIL') {
    return {
      search: 'cocktail glass ' + drink.name,
      fallback: 'cocktail glass',
    };
  }
  if (drink.category === 'NON_ALCOHOLIC') {
    if (name.includes('mojito'))
      return {
        search: 'mocktail mojito glass ' + drink.name,
        fallback: 'mocktail glass',
      };
    if (name.includes('lemonade'))
      return { search: 'lemonade glass', fallback: 'lemonade glass' };
    if (name.includes('iced tea'))
      return { search: 'iced tea glass', fallback: 'iced tea glass' };
    if (name.includes('orange juice'))
      return { search: 'orange juice glass', fallback: 'orange juice glass' };
    if (name.includes('sparkling water'))
      return {
        search: 'sparkling water bottle',
        fallback: 'sparkling water bottle',
      };
    return { search: 'non alcoholic drink glass', fallback: 'drink glass' };
  }
  return { search: drink.name, fallback: 'drink glass' };
}

// Update the downloadImage function to use stricter matching and fallback
async function downloadImage(
  query: string,
  filename: string,
  drinkType: string,
  vessel: string,
  fallback: string
) {
  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=40`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (response.data.photos.length > 0) {
      // Look for an image where the metadata contains both drinkType and vessel
      const matchingPhoto = response.data.photos.find((photo: PexelsPhoto) => {
        const url = photo.url.toLowerCase();
        const description = photo.description?.toLowerCase() || '';
        const alt = photo.alt?.toLowerCase() || '';
        return (
          (url.includes(drinkType) ||
            description.includes(drinkType) ||
            alt.includes(drinkType)) &&
          (url.includes(vessel) ||
            description.includes(vessel) ||
            alt.includes(vessel))
        );
      });
      if (matchingPhoto) {
        const imageUrl = matchingPhoto.src.medium;
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), imageResponse.data);
        console.log(
          `Downloaded strict match image for ${query} as ${filename}`
        );
        return true;
      }
    }
    // Fallback: try generic search
    if (fallback) {
      const fallbackResponse = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          fallback
        )}&per_page=10`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      if (fallbackResponse.data.photos.length > 0) {
        const imageUrl = fallbackResponse.data.photos[0].src.medium;
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), imageResponse.data);
        console.log(
          `Downloaded fallback generic image for ${fallback} as ${filename}`
        );
        return true;
      }
    }
    console.warn(`No image found for ${query} or fallback ${fallback}`);
    return false;
  } catch (error) {
    console.error(`Error downloading image for ${query}:`, error);
    return false;
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
        // Ensure drink has the correct shape for the Drink type
        const drinkForHelper = {
          name: drink.name,
          category: drink.category,
        } as Drink;
        console.log(`Processing drink: ${drink.name}`);
        const filename = generateFilename(drink.name, drink._id.toString());
        const filepath = path.join(UPLOADS_DIR, filename);

        if (fs.existsSync(filepath)) {
          console.log(
            `Image already exists for ${drink.name}, skipping download.`
          );
          continue;
        }

        const { search, fallback } = getDrinkTypeAndFallback(drinkForHelper);
        // Determine drinkType and vessel for matching
        let drinkType = '';
        let vessel = '';
        if (drink.category === 'BEER') {
          drinkType = 'beer';
          vessel = 'bottle';
        } else if (drink.category === 'WINE') {
          drinkType = 'wine';
          vessel = 'bottle';
        } else if (drink.category === 'SPIRIT') {
          drinkType = 'spirit';
          vessel = 'bottle';
        } else if (drink.category === 'COCKTAIL') {
          drinkType = 'cocktail';
          vessel = 'glass';
        } else if (drink.category === 'NON_ALCOHOLIC') {
          drinkType = 'drink';
          vessel = 'glass';
        } else {
          drinkType = 'drink';
          vessel = 'glass';
        }

        const downloaded = await downloadImage(
          search,
          filename,
          drinkType,
          vessel,
          fallback
        );
        if (downloaded) {
          await drinks.updateOne(
            { _id: new ObjectId(drink._id) },
            { $set: { imageUrl: filepath } }
          );
          console.log(`Updated drink ${drink.name} with local image`);
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
        const filename = generateFilename(
          cocktail.name,
          cocktail._id.toString()
        );
        const filepath = path.join(UPLOADS_DIR, filename);

        if (fs.existsSync(filepath)) {
          console.log(
            `Image already exists for ${cocktail.name}, skipping download.`
          );
          continue;
        }

        const downloaded = await downloadImage(
          cocktail.name,
          filename,
          '',
          '',
          ''
        );
        if (downloaded) {
          // Update database with the local file path
          await cocktails.updateOne(
            { _id: new ObjectId(cocktail._id) },
            { $set: { imageUrl: filepath } }
          );
          console.log(`Updated cocktail ${cocktail.name} with local image`);
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
