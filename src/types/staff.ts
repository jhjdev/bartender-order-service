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

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  emergencyContact: EmergencyContact;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dateOfBirth: string;
  address: Address;
  startDate: string;
  position: string;
  isActive: boolean;
  role: UserRole;
  profilePicture?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
