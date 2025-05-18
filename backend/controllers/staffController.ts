import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { staffCollection, StaffMember } from '../models/Staff';

export const staffController = {
  // Get all staff members
  getAllStaff: async (req: Request, res: Response) => {
    try {
      const staff = await staffCollection.find().toArray();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching staff members', error });
    }
  },

  // Create a new staff member
  createStaff: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const staff: StaffMember = {
        ...req.body,
        createdAt: now,
        updatedAt: now,
      };
      const result = await staffCollection.insertOne(staff);
      const createdStaff = await staffCollection.findOne({
        _id: result.insertedId,
      });
      if (!createdStaff) {
        return res
          .status(500)
          .json({ message: 'Failed to create staff member' });
      }
      res.status(201).json(createdStaff);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(400).json({ message: 'Error creating staff member', error });
      }
    }
  },

  // Update a staff member
  updateStaff: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const now = new Date();
      const updateData = {
        ...req.body,
        updatedAt: now,
      };
      console.log('Updating staff member:', { id, updateData }); // Debug log

      // Update using ObjectId
      const result = await staffCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      console.log('Update result:', result); // Debug log
      res.json(result);
    } catch (error) {
      console.error('Error updating staff member:', error); // Debug log
      if (error.code === 11000) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(400).json({ message: 'Error updating staff member', error });
      }
    }
  },

  // Delete a staff member
  deleteStaff: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await staffCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!result) {
        return res.status(404).json({ message: 'Staff member not found' });
      }
      res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting staff member', error });
    }
  },
};
