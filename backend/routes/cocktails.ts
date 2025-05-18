import { Router, Request, Response } from 'express';
import { ObjectId, Filter, WithId } from 'mongodb';
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

const router = Router();
const cocktails = client.db().collection<CocktailDocument>('cocktails');

// Get all cocktails
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const allCocktails = await cocktails
      .find({
        category: DrinkCategory.COCKTAIL,
      })
      .toArray();

    // Transform ObjectIds to strings
    const cocktailsWithStringIds = convertArrayToApiResponse(allCocktails);

    res.json(cocktailsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cocktails', error });
  }
});

// Get menu cocktails
router.get('/menu', async (req: Request, res: Response): Promise<void> => {
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
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cocktail = {
      ...req.body,
      _id: new ObjectId(),
      category: DrinkCategory.COCKTAIL,
      isInMenu: false,
    };

    const result = await cocktails.insertOne(cocktail);
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
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid cocktail ID format' });
      return;
    }

    const updateData: Partial<Omit<CocktailRecipe, '_id'>> = req.body;

    const result = await cocktails.findOneAndUpdate(
      { _id: new ObjectId(id) } as unknown as Filter<WithId<CocktailDocument>>,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ message: 'Cocktail recipe not found' });
      return;
    }

    res.json(convertToApiResponse(result));
  } catch (error) {
    res.status(500).json({ message: 'Error updating cocktail recipe', error });
  }
});

// Toggle menu status
router.patch(
  '/:id/toggle-menu',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid cocktail ID format' });
        return;
      }

      const cocktail = await cocktails.findOne({
        _id: new ObjectId(id),
      } as unknown as Filter<WithId<CocktailDocument>>);

      if (!cocktail) {
        res.status(404).json({ message: 'Cocktail not found' });
        return;
      }

      const result = await cocktails.findOneAndUpdate(
        { _id: new ObjectId(id) } as unknown as Filter<
          WithId<CocktailDocument>
        >,
        { $set: { isInMenu: !cocktail.isInMenu } },
        { returnDocument: 'after' }
      );

      if (!result) {
        res.status(404).json({ message: 'Cocktail not found' });
        return;
      }

      res.json(convertToApiResponse(result));
    } catch (error) {
      res.status(500).json({ message: 'Error toggling menu status', error });
    }
  }
);

// Delete cocktail recipe (and remove from menu)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid cocktail ID format' });
      return;
    }

    const result = await cocktails.deleteOne({
      _id: new ObjectId(id),
    } as unknown as Filter<WithId<CocktailDocument>>);

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
