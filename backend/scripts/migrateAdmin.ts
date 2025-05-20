import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const client = new MongoClient(uri);

async function migrateAdmin() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const adminsCollection = db.collection('admins');
    const staffCollection = db.collection('staff');

    // Get admin user
    const admin = await adminsCollection.findOne({
      email: 'admin@example.com',
    });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Check if admin already exists in staff collection
    const existingStaff = await staffCollection.findOne({ email: admin.email });
    if (existingStaff) {
      console.log('Admin already exists in staff collection');
      return;
    }

    // Create staff member from admin
    const staffMember = {
      firstName: admin.firstName || 'Admin',
      lastName: admin.lastName || 'User',
      email: admin.email,
      phone: admin.phone || '',
      emergencyContact: admin.emergencyContact || '',
      employmentType: 'FULL_TIME',
      age: admin.age || 30,
      gender: admin.gender || 'OTHER',
      dateOfBirth: admin.dateOfBirth || new Date().toISOString(),
      address: admin.address || '',
      startDate: admin.startDate || new Date().toISOString(),
      position: 'Administrator',
      isActive: true,
      role: 'ADMIN',
      password: admin.password,
      createdAt: admin.createdAt || new Date(),
      updatedAt: admin.updatedAt || new Date(),
    };

    await staffCollection.insertOne(staffMember);
    console.log('Admin user migrated to staff collection successfully');
  } catch (error) {
    console.error('Error migrating admin:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateAdmin().catch(console.error);
