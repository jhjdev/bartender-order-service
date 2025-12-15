import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';

const router = express.Router();

// Function to get images collection when needed
const getImagesCollection = () => {
  return db.collection('images');
};

// Configure multer for temp-uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const tempUploadsDir = path.join(__dirname, '../temp-uploads');

    // Ensure temp-uploads directory exists
    if (!fs.existsSync(tempUploadsDir)) {
      fs.mkdirSync(tempUploadsDir, { recursive: true });
    }

    cb(null, tempUploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload image to temp-uploads
router.post(
  '/upload',
  upload.single('image'),
  (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No image file provided' });
        return;
      }

      const tempImageData = {
        tempId: req.file.filename,
        originalName: req.file.originalname,
        tempPath: `/temp-uploads/${req.file.filename}`,
        uploadedAt: new Date(),
      };

      res.json({
        message: 'Image uploaded successfully',
        imageData: tempImageData,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
    }
  }
);

// Move temp image to uploads and sync to database
router.post(
  '/move-to-uploads',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { tempId, drinkId, drinkName, type } = req.body; // type: 'drink' or 'cocktail'

      if (!tempId || !drinkId || !drinkName) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const tempPath = path.join(__dirname, '../temp-uploads', tempId);
      if (!fs.existsSync(tempPath)) {
        res.status(404).json({ message: 'Temp image not found' });
        return;
      }

      // Generate standardized filename for uploads folder
      const ext = path.extname(tempId);
      const uploadName = `${drinkName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')}${ext}`;
      const uploadPath = path.join(__dirname, '../uploads', uploadName);

      // Move file from temp-uploads to uploads
      fs.renameSync(tempPath, uploadPath);

      // Create imageData for database
      const imageData = {
        _id: drinkId,
        url: `/uploads/${uploadName}`,
        name: uploadName,
      };

      // Update database
      const { MongoClient } = await import('mongodb');
      const client = new MongoClient(
        process.env.MONGODB_URI || 'mongodb://localhost:27017'
      );

      await client.connect();
      const database = client.db(process.env.DB_NAME || 'bartender-service');

      const collection =
        type === 'cocktail'
          ? database.collection('cocktails')
          : database.collection('drinks');

      await collection.updateOne({ _id: drinkId }, { $set: { imageData } });

      await client.close();

      res.json({
        message: 'Image moved to uploads and synced to database',
        imageData,
      });
    } catch (error) {
      console.error('Error moving image:', error);
      res.status(500).json({ message: 'Error moving image to uploads' });
    }
  }
);

// Clean up temp images (optional - can be called periodically)
router.delete('/cleanup-temp', (_req: Request, res: Response): void => {
  try {
    const tempUploadsDir = path.join(__dirname, '../temp-uploads');

    if (fs.existsSync(tempUploadsDir)) {
      const files = fs.readdirSync(tempUploadsDir);
      let deletedCount = 0;

      files.forEach((file) => {
        const filePath = path.join(tempUploadsDir, file);
        const stats = fs.statSync(filePath);
        const hoursOld =
          (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);

        // Delete files older than 24 hours
        if (hoursOld > 24) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });

      res.json({ message: `Cleaned up ${deletedCount} old temp files` });
    } else {
      res.json({ message: 'No temp-uploads directory found' });
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
    res.status(500).json({ message: 'Error cleaning up temp files' });
  }
});

// Serve temp images
router.get('/temp/:filename', (req: Request, res: Response): void => {
  const { filename } = req.params;
  const tempPath = path.join(__dirname, '../temp-uploads', filename);

  if (fs.existsSync(tempPath)) {
    res.sendFile(tempPath);
  } else {
    res.status(404).json({ message: 'Temp image not found' });
  }
});

// Get image from MongoDB
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid image ID' });
      return;
    }

    const imagesCollection = getImagesCollection();
    const image = await imagesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

export default router;
