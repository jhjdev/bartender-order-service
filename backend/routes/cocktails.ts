import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';
import {
  CocktailRecipe,
  DrinkCategory,
  CocktailDocument,
} from '../types/drink';
import {
  convertArrayToApiResponse,
  convertToApiResponse,
} from '../types/mongodb';
import path from 'path';

const router = Router();
const cocktails = client.db().collection<CocktailDocument>('cocktails');

// Get all cocktails
router.get('/', async (req, res) => {
  try {
    const allCocktails = await cocktails
      .find({
        category: DrinkCategory.COCKTAIL,
      })
      .toArray();

    // Transform ObjectIds to strings and convert image URLs to relative paths
    const cocktailsWithStringIds = convertArrayToApiResponse(allCocktails).map(
      (cocktail) => ({
        ...cocktail,
        imageUrl: cocktail.imageUrl
          ? `/uploads/${path.basename(cocktail.imageUrl)}`
          : undefined,
      })
    );

    res.json(cocktailsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cocktails', error });
  }
});

// Get menu cocktails
router.get('/menu', async (req, res) => {
  try {
    const menuCocktails = await cocktails
      .find({
        category: DrinkCategory.COCKTAIL,
        isInMenu: true,
      })
      .toArray();

    const cocktailsWithStringIds = convertArrayToApiResponse(menuCocktails);
    res.json(cocktailsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu cocktails', error });
  }
});

// Add new cocktail recipe
router.post('/', async (req, res) => {
  try {
    const cocktail: Omit<CocktailRecipe, '_id'> = {
      ...req.body,
      category: DrinkCategory.COCKTAIL,
      isInMenu: false, // New cocktails start off-menu by default
    };

    const result = await cocktails.insertOne(cocktail as CocktailDocument);
    const insertedCocktail = await cocktails.findOne({
      _id: result.insertedId,
    });

    if (insertedCocktail) {
      res.status(201).json(convertToApiResponse(insertedCocktail));
    } else {
      res.status(500).json({ message: 'Error retrieving created cocktail' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating cocktail recipe', error });
  }
});

// Update cocktail recipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cocktail ID format' });
    }

    const updateData: Partial<Omit<CocktailRecipe, '_id'>> = req.body;

    const result = await cocktails.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (result.value) {
      res.json(convertToApiResponse(result.value));
    } else {
      res.status(404).json({ message: 'Cocktail recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating cocktail recipe', error });
  }
});

// Toggle menu status
router.patch('/:id/toggle-menu', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cocktail ID format' });
    }

    const cocktail = await cocktails.findOne({ _id: new ObjectId(id) });
    if (!cocktail) {
      return res.status(404).json({ message: 'Cocktail not found' });
    }

    const result = await cocktails.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isInMenu: !cocktail.isInMenu } },
      { returnDocument: 'after' }
    );

    if (result.value) {
      res.json(convertToApiResponse(result.value));
    } else {
      res.status(404).json({ message: 'Cocktail not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling menu status', error });
  }
});

// Delete cocktail recipe (and remove from menu)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid cocktail ID format' });
    }

    const result = await cocktails.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Cocktail recipe deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cocktail recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cocktail recipe', error });
  }
});

export default router;
