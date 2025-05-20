import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { getEnvPath } from '../utils/paths';

// Load environment variables from the root .env file
dotenv.config({ path: getEnvPath() });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'bartender';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// At this point, MONGODB_URI is guaranteed to be a string
const uri = MONGODB_URI;

console.log('--- SEED ADMIN DEBUG ---');
console.log('MONGODB_URI:', uri);
console.log('DB_NAME:', DB_NAME);

async function seedAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    console.log('Using database:', db.databaseName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(
      'Collections in database:',
      collections.map((c) => c.name)
    );

    const admins = db.collection('admins');
    console.log('Using collection: admins');

    // Delete existing admin user
    const deleteResult = await admins.deleteOne({ email: 'admin@example.com' });
    console.log('Delete result:', deleteResult);

    // Generate password hash
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Generated password hash:', hashedPassword);

    // Create admin user
    const admin = {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      lastLogin: new Date().toISOString(),
    };

    const result = await admins.insertOne(admin);
    console.log('Admin user created:', result);

    // Verify the admin was created
    const createdAdmin = await admins.findOne({ email: 'admin@example.com' });
    console.log('Successfully created admin user:', createdAdmin);

    // Count admins
    const count = await admins.countDocuments();
    console.log('Number of admins in collection:', count);

    // Test password comparison
    const testPassword = 'test123';
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Password test result:', isValid);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
