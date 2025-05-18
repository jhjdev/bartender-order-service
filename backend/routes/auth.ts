import { Router, Request, Response } from 'express';
import { ObjectId, Filter, WithId } from 'mongodb';
import { client } from '../config/db';
import { Admin } from '../types/auth';
import { authMiddleware } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const admins = client.db().collection<Admin>('admins');

// Ensure admin user exists with correct password
async function ensureAdminExists(): Promise<void> {
  try {
    const admin = await admins.findOne({ email: 'admin@example.com' });
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!admin) {
      console.log('Creating new admin user...');
      await admins.insertOne({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
        lastLogin: new Date().toISOString(),
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Updating existing admin user...');
      await admins.updateOne(
        { email: 'admin@example.com' },
        {
          $set: {
            password: hashedPassword,
            name: 'Admin',
            lastLogin: new Date().toISOString(),
          },
        }
      );
      console.log('Admin user updated successfully');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
}

// Call this when the server starts
ensureAdminExists();

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('--- LOGIN DEBUG ---');
    console.log('Request body:', { email, password });
    console.log('Parsed email:', email);

    // Ensure admin exists before attempting login
    await ensureAdminExists();

    const admin = await admins.findOne({ email });
    console.log('Found admin:', admin);

    if (!admin) {
      console.log('No admin found with email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('Comparing passwords...');
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValid);
    console.log('Stored hash:', admin.password);
    console.log('Input password:', password);

    if (!isValid) {
      console.log('Invalid password for email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Update last login
    await admins.updateOne(
      { _id: admin._id },
      { $set: { lastLogin: new Date().toISOString() } }
    );

    // Generate token
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused, ...adminWithoutPassword } = admin;

    console.log('Login successful for:', email);
    res.json({
      token,
      admin: {
        ...adminWithoutPassword,
        _id: adminWithoutPassword._id.toString(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
});

// Verify token and get admin profile
router.get(
  '/profile',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.admin?.adminId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const admin = await admins.findOne({
        _id: new ObjectId(req.admin.adminId),
      } as unknown as Filter<WithId<Admin>>);

      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _unused, ...adminWithoutPassword } = admin;

      res.json({
        ...adminWithoutPassword,
        _id: adminWithoutPassword._id.toString(),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error });
    }
  }
);

// Change password
router.post(
  '/change-password',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.admin?.adminId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const admin = await admins.findOne({
        _id: new ObjectId(req.admin.adminId),
      } as unknown as Filter<WithId<Admin>>);

      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        admin.password
      );
      if (!isValidPassword) {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await admins.updateOne(
        { _id: admin._id },
        { $set: { password: hashedPassword } }
      );

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error });
    }
  }
);

// Initialize admin (should only be used once)
router.post('/init', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if admin already exists
    const adminExists = await admins.findOne({});
    if (adminExists) {
      res.status(400).json({ message: 'Admin already initialized' });
      return;
    }

    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin: Omit<Admin, '_id'> = {
      email,
      password: hashedPassword,
      name,
      lastLogin: new Date().toISOString(),
    };

    const result = await admins.insertOne(admin);

    // Generate token
    const token = jwt.sign(
      {
        adminId: result.insertedId.toString(),
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      admin: {
        ...admin,
        _id: result.insertedId.toString(),
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing admin', error });
  }
});

export default router;
