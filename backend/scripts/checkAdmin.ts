import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'bartender';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const uri = MONGODB_URI;

async function checkAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const admins = db.collection('admins');

    // List all admins
    const allAdmins = await admins.find({}).toArray();
    console.log('\nAll admin users:');
    allAdmins.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log('ID:', admin._id);
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Last Login:', admin.lastLogin);
      console.log('Password Hash:', admin.password);
    });

    // Check specific admin
    const admin = await admins.findOne({ email: 'admin@example.com' });
    console.log('\nSpecific admin check:');
    if (admin) {
      console.log('Admin found:', {
        email: admin.email,
        name: admin.name,
        lastLogin: admin.lastLogin,
        password: admin.password,
      });
    } else {
      console.log('No admin found with email: admin@example.com');
    }
  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkAdmin();
