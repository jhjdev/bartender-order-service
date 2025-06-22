import { connectDB } from '../config/db';
import { getStaffCollection, StaffMember } from '../models/Staff';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await getStaffCollection().findOne({
      email: 'admin@example.com',
    });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser: StaffMember = {
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      phone: {
        countryCode: '+1',
        number: '555-0123',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Spouse',
        phone: {
          countryCode: '+1',
          number: '555-0124',
        },
      },
      employmentType: 'FULL_TIME',
      age: 30,
      gender: 'OTHER',
      dateOfBirth: '1990-01-01',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'AS',
        postalCode: '12345',
        country: 'USA',
      },
      startDate: '2024-01-01',
      position: 'System Administrator',
      isActive: true,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await getStaffCollection().insertOne(adminUser);
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
