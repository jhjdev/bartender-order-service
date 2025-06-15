import { connectDB } from '../config/db';
import { staffCollection, StaffMember } from '../models/Staff';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await staffCollection.findOne({
      email: 'admin@example.com',
    });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: Omit<StaffMember, '_id'> = {
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: {
        countryCode: '+1',
        number: '1234567890',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: {
          countryCode: '+1',
          number: '0987654321',
        },
      },
      employmentType: 'FULL_TIME' as const,
      age: 30,
      gender: 'OTHER',
      dateOfBirth: '1990-01-01',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        postalCode: '12345',
        country: 'Admin Country',
      },
      startDate: new Date().toISOString(),
      position: 'Administrator',
      isActive: true,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await staffCollection.insertOne(adminUser);
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
