import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';

export const drinkController = {
  async getAllDrinks(_req: Request, res: Response) {
    try {
      const drinks = await db.collection('drinks').find().toArray();
      res.json(drinks);
    } catch (error) {
      console.error('Error fetching drinks:', error);
      res.status(500).json({ message: 'Error fetching drinks' });
    }
  },

  async createDrink(req: Request, res: Response) {
    try {
      const drinkData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('drinks').insertOne(drinkData);
      if (!result.insertedId) {
        return res.status(500).json({ message: 'Failed to create drink' });
      }

      const createdDrink = await db
        .collection('drinks')
        .findOne({ _id: result.insertedId });
      if (!createdDrink) {
        return res
          .status(500)
          .json({ message: 'Failed to fetch created drink' });
      }

      res.status(201).json(createdDrink);
    } catch (error) {
      console.error('Error creating drink:', error);
      res.status(500).json({ message: 'Error creating drink' });
    }
  },

  async updateDrink(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };

      const result = await db
        .collection('drinks')
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );

      if (!result || !result.value) {
        return res.status(404).json({ message: 'Drink not found' });
      }

      res.json(result.value);
    } catch (error) {
      console.error('Error updating drink:', error);
      res.status(500).json({ message: 'Error updating drink' });
    }
  },

  async deleteDrink(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db
        .collection('drinks')
        .findOneAndDelete({ _id: new ObjectId(id) });

      if (!result || !result.value) {
        return res.status(404).json({ message: 'Drink not found' });
      }

      res.json({ message: 'Drink deleted successfully' });
    } catch (error) {
      console.error('Error deleting drink:', error);
      res.status(500).json({ message: 'Error deleting drink' });
    }
  },

  async uploadDrinkImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Store the image in MongoDB
      const imageData = {
        _id: new ObjectId(),
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
        name: imageFile.originalname,
      };

      const result = await db
        .collection('drinks')
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { imageData, updatedAt: new Date() } },
          { returnDocument: 'after' }
        );

      if (!result || !result.value) {
        return res.status(404).json({ message: 'Drink not found' });
      }

      res.json(result.value);
    } catch (error) {
      console.error('Error uploading drink image:', error);
      res.status(500).json({ message: 'Error uploading drink image' });
    }
  },
};
