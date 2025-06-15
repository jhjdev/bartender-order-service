import { Collection, ObjectId } from 'mongodb';
import { db } from '../config/db';

export interface Phone {
  countryCode: string;
  number: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: Phone;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type UserRole = 'ADMIN' | 'STAFF';

export interface StaffMember {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  name?: string; // Full name derived from firstName and lastName
  email: string;
  password: string; // Hashed password
  phone: Phone;
  emergencyContact: EmergencyContact;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dateOfBirth: string;
  address: Address;
  startDate: string;
  endDate?: string;
  leaveType?:
    | 'MATERNITY'
    | 'PATERNITY'
    | 'STUDY'
    | 'SICK'
    | 'VACATION'
    | 'TERMINATED'
    | 'OTHER';
  position: string;
  isActive: boolean;
  role: UserRole;
  profilePicture?: string; // Base64 encoded image or URL
  createdAt?: Date;
  updatedAt?: Date;
}

export const staffCollection: Collection<StaffMember> =
  db.collection<StaffMember>('staff');

// Create indexes
staffCollection.createIndex({ email: 1 }, { unique: true });
