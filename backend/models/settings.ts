import { MongoClient } from 'mongodb';
import { Settings } from '../types/settings';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bartender';

export async function getSettings(): Promise<Settings | null> {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const settings = await db.collection('settings').findOne({});
    return settings as Settings | null;
  } finally {
    await client.close();
  }
}

export async function updateSettings(
  settings: Omit<Settings, '_id'>
): Promise<Settings> {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const result = await db.collection('settings').findOneAndUpdate(
      {}, // empty filter to match any document
      {
        $set: {
          ...settings,
          timestamps: {
            updated: new Date(),
          },
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    if (!result) {
      throw new Error('Failed to update settings');
    }

    return result as unknown as Settings;
  } finally {
    await client.close();
  }
}
