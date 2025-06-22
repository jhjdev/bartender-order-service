import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getStaffCollection, StaffMember, UserRole } from '../models/Staff';
import bcrypt from 'bcryptjs';

interface StaffMemberWithPassword extends StaffMember {
  password: string;
}

// Helper function to remove password from staff member
const removePassword = (staff: StaffMemberWithPassword): StaffMember => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...staffWithoutPassword } = staff;
  return staffWithoutPassword as StaffMember;
};

export const staffController = {
  // Get current user's profile
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const staff = await getStaffCollection().findOne({
        _id: new ObjectId(userId),
      });
      if (!staff) {
        res.status(404).json({ message: 'Staff member not found' });
        return;
      }

      // Remove password from response
      const staffWithoutPassword = removePassword(
        staff as StaffMemberWithPassword
      );
      res.json(staffWithoutPassword);
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ message: 'Error fetching current user' });
    }
  },

  // Get all staff members
  getAllStaff: async (_req: Request, res: Response): Promise<void> => {
    try {
      const staff = await getStaffCollection().find({}).toArray();
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ message: 'Error fetching staff members' });
    }
  },

  // Get staff member by ID
  getStaffById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const staff = await getStaffCollection().findOne({
        _id: new ObjectId(id),
      });

      if (!staff) {
        res.status(404).json({ message: 'Staff member not found' });
        return;
      }

      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff member:', error);
      res.status(500).json({ message: 'Error fetching staff member' });
    }
  },

  // Create new staff member
  createStaff: async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName, email, phone, position, role, password } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone?.number ||
        !position ||
        !role ||
        !password
      ) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      // Check if email already exists
      const existingStaff = await getStaffCollection().findOne({ email });
      if (existingStaff) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStaff: StaffMemberWithPassword = {
        firstName,
        lastName,
        email,
        phone: {
          countryCode: phone.countryCode || '+1',
          number: phone.number,
        },
        position,
        role: role as UserRole,
        password: hashedPassword,
        isActive: true,
        endDate: undefined,
        emergencyContact: {
          name: '',
          relationship: '',
          phone: {
            countryCode: '+1',
            number: '',
          },
        },
        employmentType: 'FULL_TIME',
        age: 0,
        gender: 'OTHER',
        dateOfBirth: new Date().toISOString(),
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        startDate: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await getStaffCollection().insertOne(newStaff);
      const createdStaff = await getStaffCollection().findOne({
        _id: result.insertedId,
      });

      if (!createdStaff) {
        res.status(500).json({ message: 'Failed to create staff member' });
        return;
      }

      // Remove password from response
      const staffWithoutPassword = removePassword(
        createdStaff as StaffMemberWithPassword
      );
      res.status(201).json(staffWithoutPassword);
    } catch (error) {
      console.error('Error creating staff member:', error);
      res.status(500).json({ message: 'Error creating staff member' });
    }
  },

  // Update staff member
  updateStaff: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        firstName,
        lastName,
        email,
        phone,
        position,
        role,
        password,
        isActive,
      } = req.body;

      if (!id) {
        res.status(400).json({ message: 'Missing staff ID' });
        return;
      }

      // Check if email already exists for other staff members
      const existingStaff = await getStaffCollection().findOne({
        email,
        _id: { $ne: new ObjectId(id) },
      });
      if (existingStaff) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const updateData: Partial<StaffMemberWithPassword> = {
        firstName,
        lastName,
        email,
        phone: phone
          ? {
              countryCode: phone.countryCode || '+1',
              number: phone.number,
            }
          : undefined,
        position,
        role: role as UserRole | undefined,
        isActive,
        endDate: isActive ? undefined : req.body.endDate,
        updatedAt: new Date(),
      };

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const result = await getStaffCollection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        res.status(404).json({ message: 'Staff member not found' });
        return;
      }

      // Remove password from response
      const staffWithoutPassword = removePassword(
        result as StaffMemberWithPassword
      );
      res.json(staffWithoutPassword);
    } catch (error) {
      console.error('Error updating staff member:', error);
      res.status(500).json({ message: 'Error updating staff member' });
    }
  },

  // Delete staff member
  deleteStaff: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: 'Missing staff ID' });
        return;
      }

      const result = await getStaffCollection().findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!result) {
        res.status(404).json({ message: 'Staff member not found' });
        return;
      }

      res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      res.status(500).json({ message: 'Error deleting staff member' });
    }
  },
};
