import { Router, Request, Response } from 'express';
import { ObjectId, Filter } from 'mongodb';
import { client } from '../config/db';
import { Order, OrderStatus, OrderDocument } from '../types/order';
import { convertArrayToApiResponse, convertToApiResponse } from '../types/mongodb';

const router = Router();
const orders = client.db().collection<OrderDocument>('orders');
const drinks = client.db().collection('drinks');

interface OrderQueryParams {
  status?: string;
  paid?: string;
  table?: string;
}

interface ErrorResponse {
  message: string;
  error?: unknown;
}

// Interfaces for order item operations
interface AddItemsBody {
  items: {
    drinkId: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    status: OrderStatus;
  }[];
}

interface OrderItemParams {
  orderId: string;
  itemId: string;
}

// Get all orders
router.get('/', async (req: Request<{}, {}, {}, OrderQueryParams>, res: Response<Order[] | ErrorResponse>): Promise<void> => {
  try {
    const { status, paid, table } = req.query;
    
    const query: Filter<OrderDocument> = {};
    
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      query.status = status as OrderStatus;
    }
    if (paid !== undefined) {
      query.isPaid = paid === 'true';
    }
    if (table && !isNaN(parseInt(table))) {
      query.tableNumber = parseInt(table);
    }

    const allOrders = await orders.find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(convertArrayToApiResponse(allOrders));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get single order
interface OrderPathParams {
  id: string;
}

router.get('/:id', async (req: Request<OrderPathParams>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await orders.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(convertToApiResponse(order));
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// Create new order
interface OrderBody {
  tableNumber: number;
  customerNumber?: string;
  items: {
    drinkId: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    status: OrderStatus;
  }[];
  isPaid: boolean;
  servedBy?: string;
  notes?: string;
}

router.post('/', async (req: Request<{}, {}, OrderBody>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    // Validate required fields
    const { tableNumber, items, isPaid } = req.body;
    
    if (tableNumber === undefined || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: tableNumber, items' });
    }
    
    const orderData: Omit<OrderDocument, '_id'> = {
      ...req.body,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total: 0, // Will be calculated
      servedBy: req.body.servedBy ? new ObjectId(req.body.servedBy) : undefined,
      items: req.body.items.map(item => ({
        ...item,
        drinkId: new ObjectId(item.drinkId)
      }))
    };

    // Validate items exist and calculate total
    const itemIds = req.body.items.map(item => new ObjectId(item.drinkId));
    const drinksData = await drinks.find({ _id: { $in: itemIds } }).toArray();
    
    if (drinksData.length !== itemIds.length) {
      return res.status(400).json({ message: 'One or more drinks not found' });
    }

    // Calculate total
    orderData.total = req.body.items.reduce((sum, item) => {
      const drink = drinksData.find(d => d._id.toString() === item.drinkId);
      if (!drink) return sum;
      return sum + (drink.price * item.quantity);
    }, 0);

    const result = await orders.insertOne(orderData);
    
    const createdOrder = await orders.findOne({ _id: result.insertedId });
    if (!createdOrder) {
      throw new Error('Failed to retrieve created order');
    }
    
    res.status(201).json(convertToApiResponse(createdOrder));
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Update order status
interface StatusUpdateBody {
  status: OrderStatus;
}

router.patch('/:id/status', async (req: Request<OrderPathParams, {}, StatusUpdateBody>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const { status } = req.body;
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json(convertToApiResponse(result));
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
});

// Update payment status
interface PaymentUpdateBody {
  isPaid: boolean;
}

router.patch('/:id/payment', async (req: Request<OrderPathParams, {}, PaymentUpdateBody>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const { isPaid } = req.body;
    if (typeof isPaid !== 'boolean') {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isPaid,
          status: isPaid ? OrderStatus.PAID : OrderStatus.DELIVERED,
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json(convertToApiResponse(result));
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});

// Add items to an order
router.post('/:id/items', async (req: Request<OrderPathParams, {}, AddItemsBody>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and must not be empty' });
    }
    const order = await orders.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate new items
    const itemIds = items.map(item => new ObjectId(item.drinkId));
    const drinksData = await drinks.find({ _id: { $in: itemIds } }).toArray();
    
    if (drinksData.length !== itemIds.length) {
      return res.status(400).json({ message: 'One or more drinks not found' });
    }

    // Convert items to OrderItemDocument format
    const formattedItems = items.map(item => ({
      ...item,
      drinkId: new ObjectId(item.drinkId)
    }));

    // Calculate new total
    const newTotal = [...order.items, ...formattedItems].reduce((sum, item) => {
      const drinkId = item.drinkId instanceof ObjectId ? item.drinkId.toString() : item.drinkId;
      const drink = drinksData.find(d => d._id.toString() === drinkId);
      if (!drink) return sum;
      return sum + (drink.price * item.quantity);
    }, 0);

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $push: { items: { $each: formattedItems } },
        $set: { 
          total: newTotal,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json(convertToApiResponse(result));
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error adding items to order:', error);
    res.status(500).json({ message: 'Error adding items to order', error });
  }
});

// Remove item from order
router.delete('/:orderId/items/:itemId', async (req: Request<OrderItemParams>, res: Response<Order | ErrorResponse>): Promise<void> => {
  try {
    const { orderId, itemId } = req.params;
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove item and recalculate total
    const updatedItems = order.items.filter(item => {
      const itemIdString = item._id instanceof ObjectId ? item._id.toString() : String(item._id);
      return itemIdString !== itemId;
    });
    const drinksData = await drinks.find({
      _id: { $in: updatedItems.map(item => new ObjectId(item.drinkId)) }
    }).toArray();

    const newTotal = updatedItems.reduce((sum, item) => {
      const drinkId = item.drinkId instanceof ObjectId ? item.drinkId.toString() : item.drinkId;
      const drink = drinksData.find(d => d._id.toString() === drinkId);
      if (!drink) return sum;
      return sum + (drink.price * item.quantity);
    }, 0);

    const result = await orders.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          items: updatedItems,
          total: newTotal,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json(convertToApiResponse(result));
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error removing item from order:', error);
    res.status(500).json({ message: 'Error removing item from order', error });
  }
});

export default router;
