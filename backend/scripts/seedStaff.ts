import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'bartender';

const staffData = [
  {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: {
      countryCode: '+1',
      number: '555-0123',
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: {
        countryCode: '+1',
        number: '555-0124',
      },
    },
    employmentType: 'FULL_TIME',
    age: 28,
    gender: 'MALE',
    dateOfBirth: '1995-05-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    startDate: '2023-01-15',
    endDate: null,
    position: 'Bartender',
    isActive: true,
    role: 'STAFF',
    leaveType: null,
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: uuidv4(),
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@example.com',
    phone: {
      countryCode: '+1',
      number: '555-0125',
    },
    emergencyContact: {
      name: 'Mike Smith',
      relationship: 'Spouse',
      phone: {
        countryCode: '+1',
        number: '555-0126',
      },
    },
    employmentType: 'PART_TIME',
    age: 25,
    gender: 'FEMALE',
    dateOfBirth: '1998-08-20',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
    startDate: '2023-03-01',
    endDate: null,
    position: 'Waitress',
    isActive: true,
    role: 'STAFF',
    leaveType: null,
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: uuidv4(),
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: {
      countryCode: '+1',
      number: '555-0127',
    },
    emergencyContact: {
      name: 'Lisa Johnson',
      relationship: 'Sister',
      phone: {
        countryCode: '+1',
        number: '555-0128',
      },
    },
    employmentType: 'FULL_TIME',
    age: 32,
    gender: 'MALE',
    dateOfBirth: '1991-11-10',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA',
    },
    startDate: '2022-11-15',
    endDate: null,
    position: 'Bar Manager',
    isActive: true,
    role: 'STAFF',
    leaveType: null,
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: uuidv4(),
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@example.com',
    phone: {
      countryCode: '+1',
      number: '555-0129',
    },
    emergencyContact: {
      name: 'David Wilson',
      relationship: 'Spouse',
      phone: {
        countryCode: '+1',
        number: '555-0130',
      },
    },
    employmentType: 'FULL_TIME',
    age: 29,
    gender: 'FEMALE',
    dateOfBirth: '1994-03-25',
    address: {
      street: '321 Elm St',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      country: 'USA',
    },
    startDate: '2023-02-01',
    endDate: '2024-01-31',
    position: 'Bartender',
    isActive: false,
    role: 'STAFF',
    leaveType: 'MATERNITY',
    password: bcrypt.hashSync('password123', 10),
  },
];

async function seedStaff() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const staffCollection = db.collection('staff');

    // Clear existing staff data
    await staffCollection.deleteMany({});
    console.log('Cleared existing staff data');

    // Insert new staff data
    const result = await staffCollection.insertMany(staffData);
    console.log(`Successfully seeded ${result.insertedCount} staff members`);
  } catch (error) {
    console.error('Error seeding staff data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedStaff().catch(console.error);
