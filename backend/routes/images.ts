import { Router } from 'express';
import { client } from '../config/db';
import { ImageData } from '../types/drink';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const uploads = client.db().collection('uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP allowed.'));
    }
  }
});

// Handle local file upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageData: ImageData = {
      url: `/uploads/${req.file.filename}`,
      source: 'upload'
    };

    // Store image metadata in MongoDB
    const result = await uploads.insertOne({
      ...imageData,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    });

    res.json({
      ...imageData,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

// Save Unsplash image URL
router.post('/unsplash', async (req, res) => {
  try {
    const { url, unsplashId } = req.body;

    if (!url || !unsplashId) {
      return res.status(400).json({ message: 'URL and Unsplash ID are required' });
    }

    const imageData: ImageData = {
      url,
      source: 'unsplash',
      unsplashId
    };

    // Store Unsplash image metadata in MongoDB
    const result = await uploads.insertOne({
      ...imageData,
      savedAt: new Date()
    });

    res.json({
      ...imageData,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving Unsplash image', error });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid image ID format' });
    }

    const image = await uploads.findOne({ _id: new ObjectId(id) });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // If it's a local upload, delete the file
    if (image.source === 'upload' && image.url) {
      const filePath = path.join(__dirname, '..', image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove from database
    await uploads.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error });
  }
});

export default router;
