export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  phone?: {
    countryCode: string;
    number: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}
