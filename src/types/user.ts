export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
