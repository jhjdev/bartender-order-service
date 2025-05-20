import { Router, RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { db } from '../config/db';
import { ObjectId } from 'mongodb';

const router = Router();

// Apply authentication middleware to all cocktail routes
router.use(authController.verifyToken as RequestHandler);

// Get all cocktails
router.get('/', (async (req, res) => {
  try {
    const cocktails = await db.collection('cocktails').find().toArray();
    res.json(cocktails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cocktails', error });
  }
}) as RequestHandler);

// Create a new cocktail
router.post('/', (async (req, res) => {
  try {
    const result = await db.collection('cocktails').insertOne(req.body);
    const cocktail = await db
      .collection('cocktails')
      .findOne({ _id: result.insertedId });
    if (!cocktail) {
      return res.status(500).json({ message: 'Failed to create cocktail' });
    }
    res.status(201).json(cocktail);
  } catch (error) {
    res.status(400).json({ message: 'Error creating cocktail', error });
  }
}) as RequestHandler);

// Update a cocktail
router.put('/:id', (async (req, res) => {
  try {
    const result = await db
      .collection('cocktails')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: 'after' }
      );
    if (!result || !result.value) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }
    res.json(result.value);
  } catch (error) {
    res.status(400).json({ message: 'Error updating cocktail', error });
  }
}) as RequestHandler);

// Delete a cocktail
router.delete('/:id', (async (req, res) => {
  try {
    const result = await db.collection('cocktails').findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (!result || !result.value) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }
    res.json({ message: 'Cocktail deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting cocktail', error });
  }
}) as RequestHandler);

export default router;
