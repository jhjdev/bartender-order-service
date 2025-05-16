export interface Admin {
  _id?: string;
  email: string;
  password: string;  // Hashed password
  name: string;
  lastLogin?: string;  // ISO date string
}

export interface AuthResponse {
  token: string;
  admin: Omit<Admin, 'password'>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenPayload {
  adminId: string;
  email: string;
}
