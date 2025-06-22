import { Router, RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { db } from '../config/db';
import { ObjectId } from 'mongodb';
import { CocktailDocument } from '../types/drink';
import { BaseDocument, convertToApiResponse } from '../types/mongodb';

const router = Router();

// Function to get cocktails collection when needed
const getCocktailsCollection = () => {
  return db.collection<CocktailDocument & BaseDocument>('cocktails');
};

// Apply authentication middleware to all cocktail routes
router.use(authController.verifyToken as RequestHandler);

// Get all cocktails
router.get('/', (async (_req, res) => {
  try {
    const cocktails = getCocktailsCollection();
    const allCocktails = await cocktails.find().toArray();
    const cocktailsWithStringIds = allCocktails.map(convertToApiResponse);
    res.json(cocktailsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cocktails', error });
  }
}) as RequestHandler);

// Create a new cocktail
router.post('/', (async (req, res) => {
  try {
    const cocktails = getCocktailsCollection();
    const result = await cocktails.insertOne(req.body);
    const cocktail = await cocktails.findOne({ _id: result.insertedId });
    if (!cocktail) {
      return res.status(500).json({ message: 'Failed to create cocktail' });
    }
    res.status(201).json(convertToApiResponse(cocktail));
  } catch (error) {
    res.status(400).json({ message: 'Error creating cocktail', error });
  }
}) as RequestHandler);

// Update a cocktail
router.put('/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cocktail ID format' });
    }

    const cocktails = getCocktailsCollection();
    const result = await cocktails.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }

    res.json(convertToApiResponse(result));
  } catch (error) {
    res.status(400).json({ message: 'Error updating cocktail', error });
  }
}) as RequestHandler);

// Delete a cocktail
router.delete('/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cocktail ID format' });
    }

    const cocktails = getCocktailsCollection();
    const result = await cocktails.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }
    res.json({ message: 'Cocktail deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting cocktail', error });
  }
}) as RequestHandler);

export default router;
