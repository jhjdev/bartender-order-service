import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';
import { DrinkCategory } from '../types/drink';

const router = Router();
const drinks = client.db().collection('drinks');

// Get all drinks (excluding cocktails)
router.get('/', async (req, res) => {
  try {
    const allDrinks = await drinks
      .find({
        category: {
          $nin: [DrinkCategory.COCKTAIL],
        },
      })
      .toArray();

    // Transform ObjectIds to strings
    const drinksWithStringIds = allDrinks.map((drink) => ({
      ...drink,
      _id: drink._id.toString(),
    }));

    res.json(drinksWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drinks', error });
  }
});

// Add new drink
router.post('/', async (req, res) => {
  try {
    const drink = {
      ...req.body,
      _id: new ObjectId(),
    };
    const result = await drinks.insertOne(drink);
    res.status(201).json({
      ...drink,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating drink', error });
  }
});

// Update drink
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid drink ID format' });
    }

    const updateData = { ...req.body };
    delete updateData._id;

    const result = await drinks.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString(),
      });
    } else {
      res.status(404).json({ message: 'Drink not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating drink', error });
  }
});

// Delete drink
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid drink ID format' });
    }

    const result = await drinks.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Drink deleted successfully' });
    } else {
      res.status(404).json({ message: 'Drink not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting drink', error });
  }
});

// Get drinks by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryDrinks = await drinks
      .find({
        category: category,
      })
      .toArray();

    // Transform ObjectIds to strings in response
    const drinksWithStringIds = categoryDrinks.map((drink) => ({
      ...drink,
      _id: drink._id.toString(),
    }));

    res.json(drinksWithStringIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching drinks by category', error });
  }
});

export default router;
