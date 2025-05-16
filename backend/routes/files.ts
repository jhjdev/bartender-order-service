import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';
import { FileMetadata, FileType } from '../types/file';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const files = client.db().collection('files');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File type validation
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes: FileType[] = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype as FileType)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileMetadata: Omit<FileMetadata, '_id'> = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype as FileType,
      description: req.body.description || '',
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      uploadedBy: req.body.userId, // Optional: if you have user authentication
      path: req.file.path
    };

    const result = await files.insertOne(fileMetadata);
    res.status(201).json({
      ...fileMetadata,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

// Get all files metadata
router.get('/', async (req, res) => {
  try {
    const allFiles = await files.find().toArray();
    const filesWithStringIds = allFiles.map(file => ({
      ...file,
      _id: file._id.toString()
    }));
    
    res.json(filesWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error });
  }
});

// Get file metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    const file = await files.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      ...file,
      _id: file._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file metadata', error });
  }
});

// Download file
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    const file = await files.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if file exists in filesystem
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File not found in storage' });
    }

    // For PDFs, check if client wants to view in browser
    const viewInBrowser = req.query.view === 'true';
    if (viewInBrowser && file.fileType === 'application/pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    }

    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error });
  }
});

// Update file metadata (description)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    const { description } = req.body;
    const result = await files.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { description } },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString()
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating file metadata', error });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    const file = await files.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete metadata from database
    await files.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
});

export default router;
