import express, { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../config/db';
import { FileMetadata, FileType } from '../types/file';

const router = express.Router();
const files = db.collection<FileMetadata>('files');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = path.join(__dirname, '../../uploads');
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

// File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload file
router.post(
  '/upload',
  upload.single('file') as unknown as RequestHandler,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const fileData: FileMetadata = {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype as FileType,
        size: req.file.size,
        path: req.file.path,
        uploadedAt: new Date().toISOString(),
      };

      const result = await files.insertOne(fileData);
      res.status(201).json({
        message: 'File uploaded successfully',
        fileId: result.insertedId,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  }
);

// Get file by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await files.findOne({ _id: id });

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(file);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// Update file metadata
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { originalName } = req.body;

    const result = await files.findOneAndUpdate(
      { _id: id },
      { $set: { originalName } },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ message: 'Error updating file' });
  }
});

// Delete file
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await files.findOne({ _id: id });

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // Delete file from filesystem
    fs.unlinkSync(file.path);

    // Delete from database
    await files.deleteOne({ _id: id });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

export default router;
