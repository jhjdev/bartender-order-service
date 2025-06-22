import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';

const router = Router();

// Function to get images collection when needed
const getImagesCollection = () => {
  return db.collection('images');
};

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload image to MongoDB
router.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const imageBuffer = req.file.buffer;
      const imageType = req.file.mimetype;
      const imageName = req.file.originalname;

      const imagesCollection = getImagesCollection();
      const result = await imagesCollection.insertOne({
        name: imageName,
        data: imageBuffer,
        contentType: imageType,
        createdAt: new Date(),
      });

      res.status(201).json({
        _id: result.insertedId.toString(),
        name: imageName,
        url: `/api/images/${result.insertedId}`,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
);

// Get image from MongoDB
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid image ID format' });
      return;
    }
    console.log('Fetching image with ID:', id);

    const imagesCollection = getImagesCollection();
    const image = await imagesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!image) {
      console.log('Image not found for ID:', id);
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    console.log('Found image:', {
      id: image._id,
      name: image.name,
      contentType: image.contentType,
      dataSize: image.data.buffer.length,
    });

    res.set('Content-Type', image.contentType);
    res.send(image.data.buffer);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

export default router;
