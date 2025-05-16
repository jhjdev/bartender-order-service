import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';
import { Admin, LoginCredentials } from '../types/auth';
import { authMiddleware } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const admins = client.db().collection('admins');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginCredentials = req.body;

    const admin = await admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
        email: admin.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      token,
      admin: {
        ...adminWithoutPassword,
        _id: adminWithoutPassword._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// Verify token and get admin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.admin?.adminId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const admin = await admins.findOne({ 
      _id: new ObjectId(req.admin.adminId) 
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      ...adminWithoutPassword,
      _id: adminWithoutPassword._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    if (!req.admin?.adminId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { currentPassword, newPassword } = req.body;

    const admin = await admins.findOne({ 
      _id: new ObjectId(req.admin.adminId) 
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
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
});

// Initialize admin (should only be used once)
router.post('/init', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await admins.findOne({});
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already initialized' });
    }

    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin: Omit<Admin, '_id'> = {
      email,
      password: hashedPassword,
      name,
      lastLogin: new Date().toISOString()
    };

    const result = await admins.insertOne(admin);

    // Generate token
    const token = jwt.sign(
      { 
        adminId: result.insertedId.toString(),
        email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      admin: {
        ...admin,
        _id: result.insertedId.toString(),
        password: undefined
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing admin', error });
  }
});

export default router;
