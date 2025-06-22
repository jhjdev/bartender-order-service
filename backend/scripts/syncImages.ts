import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getEnvPath } from '../utils/paths';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender-service';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncImages() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const drinksCollection = db.collection('drinks');
    const cocktailsCollection = db.collection('cocktails');

    const imgDir = path.join(__dirname, '../img');
    const uploadsDir = path.join(__dirname, '../uploads');

    // Step 1: Clear uploads directory
    console.log('\n🧹 Clearing uploads directory...');
    const uploadsFiles = fs.readdirSync(uploadsDir);
    for (const file of uploadsFiles) {
      if (
        file.endsWith('.jpg') ||
        file.endsWith('.jpeg') ||
        file.endsWith('.png') ||
        file.endsWith('.webp')
      ) {
        fs.unlinkSync(path.join(uploadsDir, file));
        console.log(`  Removed: ${file}`);
      }
    }

    // Step 2: Get all images from img directory
    console.log('\n📁 Reading images from img directory...');
    const imgFiles = fs
      .readdirSync(imgDir)
      .filter(
        (file) =>
          file.endsWith('.jpg') ||
          file.endsWith('.jpeg') ||
          file.endsWith('.png') ||
          file.endsWith('.webp')
      );
    console.log(`Found ${imgFiles.length} images in img directory`);

    // Step 3: Create mapping from image names to drink names
    const imageToDrinkMap = new Map();

    // Map image filenames to drink names (case-insensitive matching)
    imgFiles.forEach((imgFile) => {
      const baseName = path.basename(imgFile, path.extname(imgFile));
      const normalizedName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
      imageToDrinkMap.set(normalizedName, imgFile);
    });

    console.log('\n🗺️  Image to drink mapping:');
    imageToDrinkMap.forEach((imgFile, normalizedName) => {
      console.log(`  ${normalizedName} -> ${imgFile}`);
    });

    // Step 4: Get all drinks and cocktails from database
    const drinks = await drinksCollection.find({}).toArray();
    const cocktails = await cocktailsCollection.find({}).toArray();

    console.log(
      `\n📊 Found ${drinks.length} drinks and ${cocktails.length} cocktails in database`
    );

    // Step 5: Process drinks
    console.log('\n🍺 Processing drinks...');
    let drinksUpdated = 0;
    let drinksMissingImages = 0;

    for (const drink of drinks) {
      const drinkName = drink.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
      const matchingImage = imageToDrinkMap.get(drinkName);

      if (matchingImage) {
        // Copy image to uploads with standardized name
        const sourcePath = path.join(imgDir, matchingImage);
        const ext = path.extname(matchingImage);
        const uploadName = `${drink.name
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')}${ext}`;
        const destPath = path.join(uploadsDir, uploadName);

        fs.copyFileSync(sourcePath, destPath);

        // Update database
        const imageData = {
          name: uploadName,
          url: `/uploads/${uploadName}`,
        };

        await drinksCollection.updateOne(
          { _id: drink._id },
          { $set: { imageData } }
        );

        console.log(`  ✅ ${drink.name} -> ${uploadName}`);
        drinksUpdated++;
      } else {
        console.log(`  ❌ No image found for: ${drink.name}`);
        // Remove imageData if no image exists
        await drinksCollection.updateOne(
          { _id: drink._id },
          { $unset: { imageData: '' } }
        );
        drinksMissingImages++;
      }
    }

    // Step 6: Process cocktails
    console.log('\n🍸 Processing cocktails...');
    let cocktailsUpdated = 0;
    let cocktailsMissingImages = 0;

    for (const cocktail of cocktails) {
      const cocktailName = cocktail.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
      const matchingImage = imageToDrinkMap.get(cocktailName);

      if (matchingImage) {
        // Copy image to uploads with standardized name
        const sourcePath = path.join(imgDir, matchingImage);
        const ext = path.extname(matchingImage);
        const uploadName = `${cocktail.name
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')}${ext}`;
        const destPath = path.join(uploadsDir, uploadName);

        fs.copyFileSync(sourcePath, destPath);

        // Update database
        const imageData = {
          name: uploadName,
          url: `/uploads/${uploadName}`,
        };

        await cocktailsCollection.updateOne(
          { _id: cocktail._id },
          { $set: { imageData } }
        );

        console.log(`  ✅ ${cocktail.name} -> ${uploadName}`);
        cocktailsUpdated++;
      } else {
        console.log(`  ❌ No image found for: ${cocktail.name}`);
        // Remove imageData if no image exists
        await cocktailsCollection.updateOne(
          { _id: cocktail._id },
          { $unset: { imageData: '' } }
        );
        cocktailsMissingImages++;
      }
    }

    // Step 7: Summary
    console.log('\n📊 SYNC SUMMARY:');
    console.log(`Drinks updated: ${drinksUpdated}`);
    console.log(`Drinks missing images: ${drinksMissingImages}`);
    console.log(`Cocktails updated: ${cocktailsUpdated}`);
    console.log(`Cocktails missing images: ${cocktailsMissingImages}`);
    console.log(
      `Total images copied to uploads: ${drinksUpdated + cocktailsUpdated}`
    );

    // Step 8: Verify uploads directory
    const finalUploadsFiles = fs
      .readdirSync(uploadsDir)
      .filter(
        (file) =>
          file.endsWith('.jpg') ||
          file.endsWith('.jpeg') ||
          file.endsWith('.png') ||
          file.endsWith('.webp')
      );
    console.log(
      `\n📁 Final uploads directory contains ${finalUploadsFiles.length} images`
    );

    await client.close();
    console.log('\n✅ Image sync completed successfully!');
    console.log(
      '🎉 Database and uploads folder are now perfectly synchronized!'
    );
  } catch (error) {
    console.error('Error:', error);
    await client.close();
  }
}

syncImages();
