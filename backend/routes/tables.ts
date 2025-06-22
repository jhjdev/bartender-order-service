import { Router } from 'express';
import { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';
import { Table, TableLayout, TableWithOrders } from '../types/table';
import { Order, OrderStatus, OrderDocument } from '../types/order';
import { BaseDocument, convertToApiResponse } from '../types/mongodb';

const router = Router();
const tables = db.collection<Table & BaseDocument>('tables');
const layouts = db.collection<TableLayout & BaseDocument>('tableLayouts');
const orders = db.collection<OrderDocument>('orders');

// Helper function to convert OrderDocument to Order
const convertOrderToApiResponse = (order: OrderDocument): Order => {
  const { _id, items, servedBy, ...rest } = order;
  return {
    ...rest,
    _id: _id.toString(),
    items: items.map((item) => ({
      ...item,
      _id: item._id?.toString(),
      drinkId: item.drinkId.toString(),
    })),
    servedBy: servedBy?.toString(),
  };
};

// Get active layout with tables
router.get('/layout', (async (_req, res) => {
  try {
    const activeLayout = await layouts.findOne({ isActive: true });
    if (!activeLayout) {
      return res.status(404).json({ message: 'No active layout found' });
    }

    const tableIds = activeLayout.tables
      .map((table) =>
        typeof table === 'string' ? new ObjectId(table) : table._id
      )
      .filter((id): id is ObjectId => id !== undefined);

    const tablesData = await tables
      .find({
        _id: { $in: tableIds },
      })
      .toArray();

    // Get current active orders for these tables
    const currentOrders = await orders
      .find({
        tableNumber: { $in: tablesData.map((table) => table.number) },
        status: { $nin: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      })
      .toArray();

    // Get recent order history for these tables (last 5 orders per table)
    const tableNumbers = tablesData.map((table) => table.number);
    const recentOrders = await orders
      .find({
        tableNumber: { $in: tableNumbers },
        status: { $in: [OrderStatus.PAID, OrderStatus.CANCELLED] },
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Group orders by table number
    const ordersByTable = recentOrders.reduce((acc, order) => {
      if (!acc[order.tableNumber]) {
        acc[order.tableNumber] = [];
      }
      if (acc[order.tableNumber].length < 5) {
        acc[order.tableNumber].push(convertOrderToApiResponse(order));
      }
      return acc;
    }, {} as Record<number, Order[]>);

    const tablesWithOrders = tablesData.map((table) => {
      const currentOrder = currentOrders.find(
        (order) => order.tableNumber === table.number
      );
      const tableWithStringId = convertToApiResponse(table);
      return {
        ...tableWithStringId,
        currentOrder: currentOrder
          ? convertOrderToApiResponse(currentOrder)
          : undefined,
        previousOrders: ordersByTable[table.number] || [],
      } as unknown as TableWithOrders;
    });

    res.json({
      ...convertToApiResponse(activeLayout),
      tables: tablesWithOrders,
    });
  } catch (error) {
    console.error('Error fetching table layout:', error);
    res.status(500).json({ message: 'Error fetching table layout', error });
  }
}) as RequestHandler);

// Get table order history
router.get('/:id/orders', (async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid table ID format' });
    }

    const table = await tables.findOne({ _id: new ObjectId(id) });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const tableOrders = await orders
      .find({ tableNumber: table.number })
      .sort({ createdAt: -1 })
      .toArray();

    const ordersWithStringIds = tableOrders.map(convertOrderToApiResponse);

    res.json(ordersWithStringIds);
  } catch (error) {
    console.error('Error fetching table orders:', error);
    res.status(500).json({ message: 'Error fetching table orders', error });
  }
}) as RequestHandler);

export default router;
