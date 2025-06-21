import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderNote,
} from '../models/order';

export const orderController = {
  // Create a new order
  createOrder: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const orderData: CreateOrderRequest = req.body;

      // Validate required fields
      if (
        !orderData.customerNumber ||
        !orderData.items ||
        orderData.items.length === 0
      ) {
        return res.status(400).json({
          error: 'Customer number and items are required',
        });
      }

      // Get drinks to calculate prices
      const drinksCollection = db.collection('drinks');
      const drinkIds = orderData.items.map(
        (item) => new ObjectId(item.drinkId)
      );
      const drinks = await drinksCollection
        .find({ _id: { $in: drinkIds } })
        .toArray();

      // Calculate total amount and prepare items
      let totalAmount = 0;
      const items = orderData.items.map((item) => {
        const drink = drinks.find((d) => d._id.toString() === item.drinkId);
        if (!drink) {
          throw new Error(`Drink with ID ${item.drinkId} not found`);
        }
        const itemTotal = drink.price * item.quantity;
        totalAmount += itemTotal;

        return {
          _id: new ObjectId(),
          drinkId: new ObjectId(item.drinkId),
          name: drink.name,
          quantity: item.quantity,
          price: drink.price,
          notes: item.notes,
        };
      });

      // Prepare notes with timestamps
      const notes: OrderNote[] = (orderData.notes || []).map((note) => ({
        _id: new ObjectId(),
        text: note.text,
        author: note.author,
        timestamp: new Date(),
        category: note.category,
      }));

      // Create order object
      const order: Order = {
        customerNumber: orderData.customerNumber,
        tableNumber: orderData.tableNumber,
        staffId: orderData.staffId
          ? new ObjectId(orderData.staffId)
          : undefined,
        items,
        totalAmount,
        status: 'pending',
        paymentStatus: 'unpaid',
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert order into database
      const result = await db.collection('orders').insertOne(order);
      const createdOrder = { ...order, _id: result.insertedId };

      // Emit WebSocket event
      const io = req.app.get('io');
      io.to('orders').emit('order:created', createdOrder);

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get all orders
  getOrders: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const { status, limit = 50, page = 1 } = req.query;

      let filter = {};
      if (status) {
        filter = { status };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const orders = await db
        .collection('orders')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray();

      const total = await db.collection('orders').countDocuments(filter);

      res.json({
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get order by ID
  getOrderById: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const { id } = req.params;

      const order = await db.collection('orders').findOne({
        _id: new ObjectId(id),
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Update order
  updateOrder: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const updateData: UpdateOrderRequest = req.body;

      // Prepare update object
      const update: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (updateData.status) {
        update.status = updateData.status;
        if (updateData.status === 'completed') {
          update.completedAt = new Date();
        }
      }

      if (updateData.paymentStatus) {
        update.paymentStatus = updateData.paymentStatus;
      }

      if (updateData.paymentMethod) {
        update.paymentMethod = updateData.paymentMethod;
      }

      if (updateData.notes) {
        // Add new notes with timestamps
        const newNotes: OrderNote[] = updateData.notes.map((note) => ({
          _id: new ObjectId(),
          text: note.text,
          author: note.author,
          timestamp: new Date(),
          category: note.category,
        }));

        update.$push = { notes: { $each: newNotes } };
      }

      const result = await db
        .collection('orders')
        .findOneAndUpdate({ _id: new ObjectId(id) }, update, {
          returnDocument: 'after',
        });

      if (!result) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Emit WebSocket event
      const io = req.app.get('io');
      io.to('orders').emit('order:updated', result);

      res.json(result);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Delete order
  deleteOrder: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const { id } = req.params;

      const result = await db.collection('orders').deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Emit WebSocket event
      const io = req.app.get('io');
      io.to('orders').emit('order:deleted', { id });

      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Add note to order
  addNote: async (req: Request, res: Response) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const {
        text,
        author,
        category = 'general',
      }: Omit<OrderNote, 'timestamp'> = req.body;

      if (!text || !author) {
        return res.status(400).json({
          error: 'Text and author are required',
        });
      }

      const note: OrderNote = {
        _id: new ObjectId(),
        text,
        author,
        timestamp: new Date(),
        category,
      };

      const update: Record<string, unknown> = {
        $push: { notes: note },
        $set: { updatedAt: new Date() },
      };

      const result = await db
        .collection('orders')
        .findOneAndUpdate({ _id: new ObjectId(id) }, update, {
          returnDocument: 'after',
        });

      if (!result) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Emit WebSocket event
      const io = req.app.get('io');
      io.to('orders').emit('order:updated', result);

      res.json(result);
    } catch (error) {
      console.error('Error adding note:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
