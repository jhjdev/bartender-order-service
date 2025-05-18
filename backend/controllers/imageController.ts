import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageBuffer = req.file.buffer;
    const imageType = req.file.mimetype;
    const imageName = req.file.originalname;

    const result = await db.collection('images').insertOne({
      name: imageName,
      data: imageBuffer,
      contentType: imageType,
      createdAt: new Date(),
    });

    res.status(201).json({
      _id: result.insertedId,
      name: imageName,
      url: `/api/images/${result.insertedId}`,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await db.collection('images').findOne({
      _id: new ObjectId(id),
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data.buffer);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};
