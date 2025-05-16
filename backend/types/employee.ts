import { ObjectId } from 'mongodb';
import { BaseDocument } from './mongodb';

export enum JobTitle {
  BARTENDER = 'BARTENDER',
  HEAD_BARTENDER = 'HEAD_BARTENDER',
  BAR_BACK = 'BAR_BACK',
  MANAGER = 'MANAGER',
  TRAINEE = 'TRAINEE'
}

export interface ContactInfo {
  email: string;
  phone: {
    countryCode: string;  // e.g., "+1", "+44"
    number: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

// Client-side interfaces
export interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;  // ISO date string
  jobTitle: JobTitle;
  contact: ContactInfo;
  startDate: string;    // ISO date string
  active: boolean;      // Whether employee is currently employed
  notes?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: {
      countryCode: string;
      number: string;
    };
  };
}

export interface TimeOff {
  _id?: string;
  employeeId: string;
  type: 'VACATION' | 'SICK_LEAVE' | 'PERSONAL' | 'UNPAID';
  startDate: string;    // ISO date string
  endDate: string;      // ISO date string
  approved: boolean;
  approvedBy?: string;  // Manager's ID
  requestDate: string;  // ISO date string
  notes?: string;
}

export interface Shift {
  _id?: string;
  employeeId: string;
  date: string;         // ISO date string
  startTime: string;    // HH:mm format
  endTime: string;      // HH:mm format
  position: JobTitle;
  notes?: string;
}

// MongoDB document interfaces
export interface EmployeeDocument extends Omit<Employee, '_id'>, BaseDocument {}

export interface TimeOffDocument extends Omit<TimeOff, '_id' | 'employeeId' | 'approvedBy'>, BaseDocument {
  employeeId: ObjectId;
