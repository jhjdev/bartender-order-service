import { Router, RequestHandler } from 'express';
import { authController } from '../controllers/authController';
import { drinkController } from '../controllers/drinkController';
import multer from 'multer';
import { db } from '../config/db';
import { ObjectId } from 'mongodb';

const router = Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Apply authentication middleware to all drink routes
router.use(authController.verifyToken as RequestHandler);

// Drink routes
router.get('/', (async (req, res) => {
  drinkController.getAllDrinks(req, res);
}) as RequestHandler);

router.post('/', (async (req, res) => {
  drinkController.createDrink(req, res);
}) as RequestHandler);

router.put('/:id', (async (req, res) => {
  drinkController.updateDrink(req, res);
}) as RequestHandler);

router.delete('/:id', (async (req, res) => {
  drinkController.deleteDrink(req, res);
}) as RequestHandler);

router.post('/:id/image', upload.single('image'), (async (req, res) => {
  drinkController.uploadDrinkImage(req, res);
}) as RequestHandler);

// Serve drink image
router.get('/:id/image', (async (req, res) => {
  try {
    const { id } = req.params;
    const drink = await db
      .collection('drinks')
      .findOne({ _id: new ObjectId(id) });

    if (!drink || !drink.imageData) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', drink.imageData.contentType);
    res.send(drink.imageData.data);
  } catch (error) {
    console.error('Error serving drink image:', error);
    res.status(500).json({ message: 'Error serving drink image' });
  }
}) as RequestHandler);

export default router;
