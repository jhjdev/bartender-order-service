import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender-service';

interface ImportOptions {
  collectionName: string;
  sourceFile: string;
  timestampField?: string;
}

async function importData() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  console.log('Connected to MongoDB');

  const importTasks: ImportOptions[] = [
    {
      collectionName: 'staff',
      sourceFile: 'test.staff.json',
      timestampField: 'updatedAt',
    },
    {
      collectionName: 'images',
      sourceFile: 'test.images.json',
      timestampField: 'uploadedAt',
    },
    {
      collectionName: 'drinks',
      sourceFile: 'test.drinks.json',
      timestampField: 'updatedAt',
    },
    {
      collectionName: 'cocktails',
      sourceFile: 'test.cocktails.json',
      timestampField: 'updatedAt',
    },
  ];

  for (const task of importTasks) {
    try {
      console.log(`\nProcessing ${task.collectionName}...`);

      // Read the source file
      const sourcePath = path.join(__dirname, '../../data', task.sourceFile);
      const data = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

      if (!Array.isArray(data)) {
        console.error(`Invalid data format in ${task.sourceFile}`);
        continue;
      }

      const collection = db.collection(task.collectionName);

      // Get existing documents
      const existingDocs = await collection.find({}).toArray();
      const existingMap = new Map(
        existingDocs.map((doc) => [doc._id.toString(), doc])
      );

      let imported = 0;
      let updated = 0;
      let skipped = 0;

      for (const doc of data) {
        const docId = doc._id.toString();
        const existingDoc = existingMap.get(docId);

        if (existingDoc && task.timestampField) {
          // Compare timestamps if both documents have them
          const existingTimestamp = new Date(
            existingDoc[task.timestampField]
          ).getTime();
          const newTimestamp = new Date(doc[task.timestampField]).getTime();

          if (newTimestamp <= existingTimestamp) {
            skipped++;
            continue;
          }
        }

        // Handle MongoDB extended JSON format for _id
        if (doc._id && typeof doc._id === 'object' && '$oid' in doc._id) {
          doc._id = new ObjectId(doc._id.$oid);
        } else if (
          typeof doc._id === 'string' &&
          /^[a-fA-F0-9]{24}$/.test(doc._id)
        ) {
          doc._id = new ObjectId(doc._id);
        }

        if (existingDoc) {
          await collection.replaceOne({ _id: doc._id }, doc);
          updated++;
        } else {
          await collection.insertOne(doc);
          imported++;
        }
      }

      console.log(`Results for ${task.collectionName}:`);
      console.log(`- Imported: ${imported}`);
      console.log(`- Updated: ${updated}`);
      console.log(`- Skipped: ${skipped}`);
    } catch (error) {
      console.error(`Error processing ${task.collectionName}:`, error);
    }
  }

  await client.close();
  console.log('\nImport completed');
}

importData().catch(console.error);
