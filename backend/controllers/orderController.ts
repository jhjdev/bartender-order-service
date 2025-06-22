import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderNote,
} from '../models/order';

// Validation helpers
const validateOrderStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  return validStatuses.includes(status);
};

const validatePaymentStatus = (status: string): boolean => {
  const validStatuses = ['unpaid', 'partially_paid', 'paid'];
  return validStatuses.includes(status);
};

const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['cash', 'card', 'split'];
  return validMethods.includes(method);
};

const validateOrderTransition = (
  currentStatus: string,
  newStatus: string
): boolean => {
  const validTransitions: Record<string, string[]> = {
    pending: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [], // No further transitions
    cancelled: [], // No further transitions
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

export const orderController = {
  // Create a new order
  createOrder: async (req: Request, res: Response) => {
    try {
      const orderData: CreateOrderRequest = req.body;

      // Enhanced validation
      if (!orderData.customerNumber || orderData.customerNumber.trim() === '') {
        return res.status(400).json({
          error: 'Customer number is required and cannot be empty',
        });
      }

      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({
          error: 'Order must contain at least one item',
        });
      }

      // Validate each item
      for (const item of orderData.items) {
        if (!item.drinkId || !ObjectId.isValid(item.drinkId)) {
          return res.status(400).json({
            error: 'Invalid drink ID provided',
          });
        }
        if (!item.quantity || item.quantity <= 0) {
          return res.status(400).json({
            error: 'Item quantity must be greater than 0',
          });
        }
      }

      // Get drinks to calculate prices
      const drinksCollection = db.collection('drinks');
      const drinkIds = orderData.items.map(
        (item) => new ObjectId(item.drinkId)
      );
      const drinks = await drinksCollection
        .find({ _id: { $in: drinkIds } })
        .toArray();

      // Validate all drinks exist
      if (drinks.length !== orderData.items.length) {
        const foundDrinkIds = drinks.map((d) => d._id.toString());
        const missingDrinks = orderData.items.filter(
          (item) => !foundDrinkIds.includes(item.drinkId)
        );
        return res.status(400).json({
          error: `Drinks not found: ${missingDrinks
            .map((d) => d.drinkId)
            .join(', ')}`,
        });
      }

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
        customerNumber: orderData.customerNumber.trim(),
        tableNumber: orderData.tableNumber?.trim(),
        staffId:
          orderData.staffId && ObjectId.isValid(orderData.staffId)
            ? new ObjectId(orderData.staffId)
            : undefined,
        items,
        totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
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

  // Get all orders with advanced filtering
  getOrders: async (req: Request, res: Response) => {
    try {
      const {
        status,
        paymentStatus,
        staffId,
        tableNumber,
        customerNumber,
        startDate,
        endDate,
        limit = 50,
        page = 1,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      // Build filter object
      const filter: Record<string, unknown> = {};

      if (status && validateOrderStatus(status as string)) {
        filter.status = status;
      }

      if (paymentStatus && validatePaymentStatus(paymentStatus as string)) {
        filter.paymentStatus = paymentStatus;
      }

      if (staffId && ObjectId.isValid(staffId as string)) {
        filter.staffId = new ObjectId(staffId as string);
      }

      if (tableNumber) {
        filter.tableNumber = tableNumber;
      }

      if (customerNumber) {
        filter.customerNumber = { $regex: customerNumber, $options: 'i' };
      }

      // Date range filtering
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          (filter.createdAt as Record<string, unknown>).$gte = new Date(
            startDate as string
          );
        }
        if (endDate) {
          (filter.createdAt as Record<string, unknown>).$lte = new Date(
            endDate as string
          );
        }
      }

      // Validate sort parameters
      const validSortFields = [
        'createdAt',
        'updatedAt',
        'totalAmount',
        'status',
        'customerNumber',
      ];
      const sortField = validSortFields.includes(sortBy as string)
        ? sortBy
        : 'createdAt';
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      const skip = (Number(page) - 1) * Number(limit);
      const orders = await db
        .collection('orders')
        .find(filter)
        .sort({ [sortField as string]: sortDirection })
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
        filters: {
          status,
          paymentStatus,
          staffId,
          tableNumber,
          customerNumber,
          startDate,
          endDate,
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
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
      }

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

  // Update order with status transition validation
  updateOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateOrderRequest = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
      }

      // Get current order to validate transitions
      const currentOrder = await db.collection('orders').findOne({
        _id: new ObjectId(id),
      });

      if (!currentOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Validate status transition
      if (
        updateData.status &&
        !validateOrderTransition(currentOrder.status, updateData.status)
      ) {
        return res.status(400).json({
          error: `Invalid status transition from ${currentOrder.status} to ${updateData.status}`,
        });
      }

      // Validate payment status
      if (
        updateData.paymentStatus &&
        !validatePaymentStatus(updateData.paymentStatus)
      ) {
        return res.status(400).json({
          error: 'Invalid payment status',
        });
      }

      // Validate payment method
      if (
        updateData.paymentMethod &&
        !validatePaymentMethod(updateData.paymentMethod)
      ) {
        return res.status(400).json({
          error: 'Invalid payment method',
        });
      }

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
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
      }

      // Check if order exists and can be deleted
      const order = await db.collection('orders').findOne({
        _id: new ObjectId(id),
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Prevent deletion of completed orders (optional business rule)
      if (order.status === 'completed') {
        return res.status(400).json({
          error: 'Cannot delete completed orders. Consider cancelling instead.',
        });
      }

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
      const { id } = req.params;
      const {
        text,
        author,
        category = 'general',
      }: Omit<OrderNote, 'timestamp'> = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
      }

      if (!text || text.trim() === '') {
        return res.status(400).json({
          error: 'Note text is required and cannot be empty',
        });
      }

      if (!author || author.trim() === '') {
        return res.status(400).json({
          error: 'Author is required and cannot be empty',
        });
      }

      const note: OrderNote = {
        _id: new ObjectId(),
        text: text.trim(),
        author: author.trim(),
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

  // Process payment for order
  processPayment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isPaid = true, paymentMethod, amount } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID format' });
      }

      // Validate payment method if provided
      if (paymentMethod && !validatePaymentMethod(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      // Validate amount if provided
      if (amount && (typeof amount !== 'number' || amount < 0)) {
        return res
          .status(400)
          .json({ error: 'Amount must be a positive number' });
      }

      const update: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      // Update payment status
      if (isPaid) {
        update.paymentStatus = 'paid';
        update.paymentMethod = paymentMethod || 'card';
      } else {
        update.paymentStatus = 'unpaid';
        update.paymentMethod = undefined;
      }

      // If partial payment, handle it
      if (amount && amount > 0) {
        update.paymentStatus = 'partially_paid';
        update.paymentMethod = paymentMethod || 'card';
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
      console.error('Error processing payment:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get order statistics
  getOrderStats: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      let dateFilter = {};
      if (startDate || endDate) {
        dateFilter = {
          createdAt: {
            ...(startDate && { $gte: new Date(startDate as string) }),
            ...(endDate && { $lte: new Date(endDate as string) }),
          },
        };
      }

      const stats = await db
        .collection('orders')
        .aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$totalAmount' },
              averageOrderValue: { $avg: '$totalAmount' },
              pendingOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
              },
              inProgressOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] },
              },
              completedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              paidOrders: {
                $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] },
              },
            },
          },
        ])
        .toArray();

      const result = stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
        paidOrders: 0,
      };

      res.json(result);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
