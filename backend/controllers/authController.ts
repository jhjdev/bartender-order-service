import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { staffCollection, StaffMember, UserRole } from '../models/Staff';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend StaffMember type to include password
interface StaffMemberWithPassword extends StaffMember {
  password: string;
}

// JWT payload type
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: JWTPayload;
  }
}

// Helper function to remove password from staff member
const removePassword = (staff: StaffMemberWithPassword): StaffMember => {
  const staffWithoutPassword = { ...staff } as { password?: string } & Omit<
    StaffMemberWithPassword,
    'password'
  >;
  delete staffWithoutPassword.password;
  return staffWithoutPassword;
};

export const authController = {
  // Login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      // Find user by email
      const user = (await staffCollection.findOne({
        email: email,
      })) as StaffMemberWithPassword | null;
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({ message: 'Account is inactive' });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id?.toString(),
          email: user.email,
          role: user.role,
        } as JWTPayload,
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data and token
      const userData = removePassword(user);
      res.json({
        token,
        user: userData,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = (await staffCollection.findOne({
        _id: new ObjectId(userId),
      })) as StaffMemberWithPassword | null;
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userData = removePassword(user);
      res.json(userData);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  },

  // Middleware to verify JWT token
  verifyToken: (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  },

  // Middleware to check if user is admin
  requireAdmin: (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    next();
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const { firstName, lastName, email, phone, position, password, name } =
        req.body as {
          firstName: string;
          lastName: string;
          email: string;
          phone: { countryCode: string; number: string };
          position: string;
          password?: string;
          name?: string;
        };

      // Check if email already exists for other users
      const existingUser = await staffCollection.findOne({
        email,
        _id: { $ne: new ObjectId(userId) },
      });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const updateData: Partial<StaffMemberWithPassword> = {
        firstName,
        lastName,
        email,
        phone: {
          countryCode: phone.countryCode || '+1',
          number: phone.number,
        },
        position,
        updatedAt: new Date(),
      };

      // Set the name field based on firstName and lastName
      if (firstName || lastName) {
        updateData.name = `${firstName || ''} ${lastName || ''}`.trim();
      } else if (name) {
        updateData.name = name;
      }

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const result = await staffCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = removePassword(result as StaffMemberWithPassword);
      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  },
};
