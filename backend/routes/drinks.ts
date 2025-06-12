import express, { RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { ObjectId } from 'mongodb';
import { convertToApiResponse } from '../types/mongodb';
import multer from 'multer';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../config/db';
import { Drink } from '../types/drink';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = path.join(__dirname, '../../uploads/drinks');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Apply authentication middleware to all drink routes
router.use(authController.verifyToken as RequestHandler);

// Get all drinks
router.get('/', (async (_req, res) => {
  try {
    const drinks = db.collection<Drink>('drinks');
    const allDrinks = await drinks.find().toArray();
    const drinksWithStringIds = allDrinks.map(convertToApiResponse);
    res.json(drinksWithStringIds);
  } catch (error) {
    console.error('Error fetching drinks:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      res.status(500).json({
        message: 'Error fetching drinks',
        error: error.message,
        stack: error.stack,
      });
    } else {
      res
        .status(500)
        .json({ message: 'Error fetching drinks', error: String(error) });
    }
  }
}) as RequestHandler);

// Create a new drink
router.post('/', (async (req, res) => {
  try {
    const drinks = db.collection<Drink>('drinks');
    const result = await drinks.insertOne(req.body);
    const drink = await drinks.findOne({ _id: result.insertedId });
    if (!drink) {
      res.status(500).json({ message: 'Failed to create drink' });
      return;
    }
    res.status(201).json(convertToApiResponse(drink));
  } catch (error) {
    res.status(400).json({ message: 'Error creating drink', error });
  }
}) as RequestHandler);

// Update a drink
router.put('/:id', (async (req, res) => {
  try {
    const drinks = db.collection<Drink>('drinks');
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid drink ID format' });
      return;
    }

    const result = await drinks.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ message: 'Drink not found' });
      return;
    }

    res.json(convertToApiResponse(result));
  } catch (error) {
    res.status(400).json({ message: 'Error updating drink', error });
  }
}) as RequestHandler);

// Delete a drink
router.delete('/:id', (async (req, res) => {
  try {
    const drinks = db.collection<Drink>('drinks');
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid drink ID format' });
      return;
    }

    const result = await drinks.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) {
      res.status(404).json({ message: 'Drink not found' });
      return;
    }
    res.json({ message: 'Drink deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting drink', error });
  }
}) as RequestHandler);

// Image upload route
router.post(
  '/:id/image',
  upload.single('image') as unknown as RequestHandler,
  async (req: Request, res: Response) => {
    try {
      const drinks = db.collection<Drink>('drinks');
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const drink = await drinks.findOne({ _id: new ObjectId(id) });
      if (!drink) {
        // Delete the uploaded file if drink not found
        fs.unlinkSync(file.path);
        res.status(404).json({ message: 'Drink not found' });
        return;
      }

      // Delete old image if exists
      if (drink.imageData && drink.imageData.url) {
        const oldImagePath = path.join(
          __dirname,
          '../../',
          drink.imageData.url
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update drink with new imageData
      const relativePath = path.relative(
        path.join(__dirname, '../../'),
        file.path
      );
      const imageData = {
        _id: new ObjectId().toString(),
        url: relativePath,
        name: file.originalname,
      };
      await drinks.updateOne(
        { _id: new ObjectId(id) },
        { $set: { imageData } }
      );

      res.json({
        message: 'Image uploaded successfully',
        imageData,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
    }
  }
);

// Serve drink image
router.get('/:id/image', (async (req, res) => {
  try {
    const drinks = db.collection<Drink>('drinks');
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid drink ID format' });
      return;
    }

    const drink = await drinks.findOne({ _id: new ObjectId(id) });
    if (!drink?.imageData?.url) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    const imagePath = path.join(__dirname, '../../', drink.imageData.url);
    if (!fs.existsSync(imagePath)) {
      res.status(404).json({ message: 'Image file not found' });
      return;
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(400).json({ message: 'Error serving image', error });
  }
}) as RequestHandler);

export default router;
