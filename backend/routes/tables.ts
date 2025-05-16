import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';
import { Table, TableLayout, TableSection } from '../types/table';

const router = Router();
const tables = client.db().collection('tables');
const layouts = client.db().collection('tableLayouts');
const sections = client.db().collection('tableSections');
const orders = client.db().collection('orders');

// Get active layout with tables
router.get('/layout', async (req, res) => {
  try {
    const activeLayout = await layouts.findOne({ isActive: true });
    if (!activeLayout) {
      return res.status(404).json({ message: 'No active layout found' });
    }

    // Get all tables for this layout
    const tablesData = await tables.find({
      _id: { 
        $in: activeLayout.tables.map(table => 
          typeof table === 'string' ? new ObjectId(table) : table
        )
      }
    }).toArray();

    // Get current orders for occupied tables
    const currentOrders = await orders.find({
      tableNumber: { $in: tablesData.map(table => table.number) },
      status: { $nin: ['COMPLETED', 'CANCELLED'] }
    }).toArray();

    // Combine table data with current orders
    const tablesWithOrders = tablesData.map(table => ({
      ...table,
      _id: table._id.toString(),
      currentOrder: currentOrders.find(order => order.tableNumber === table.number)
    }));

    res.json({
      ...activeLayout,
      _id: activeLayout._id.toString(),
      tables: tablesWithOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table layout', error });
  }
});

// Create new table
router.post('/', async (req, res) => {
  try {
    const table: Omit<Table, '_id'> = req.body;
    
    // Ensure table number is unique
    const existingTable = await tables.findOne({ number: table.number });
    if (existingTable) {
      return res.status(409).json({ message: 'Table number already exists' });
    }

    const result = await tables.insertOne(table);
    
    // Add table to active layout
    await layouts.updateOne(
      { isActive: true },
      { $push: { tables: result.insertedId } }
    );

    res.status(201).json({
      ...table,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating table', error });
  }
});

// Update table
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid table ID format' });
    }

    const updateData: Partial<Table> = req.body;
    delete updateData._id;

    const result = await tables.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString()
      });
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating table', error });
  }
});

// Update table status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid table ID format' });
    }

    const { status } = req.body;
    const result = await tables.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString()
      });
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating table status', error });
  }
});

// Get table order history
router.get('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid table ID format' });
    }

    const table = await tables.findOne({ _id: new ObjectId(id) });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const tableOrders = await orders.find({
      tableNumber: table.number
    })
    .sort({ createdAt: -1 })
    .toArray();

    const ordersWithStringIds = tableOrders.map(order => ({
      ...order,
      _id: order._id.toString()
    }));

    res.json(ordersWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table orders', error });
  }
});

// Save new layout
router.post('/layout', async (req, res) => {
  try {
    const layout: Omit<TableLayout, '_id'> = {
      ...req.body,
      lastModified: new Date().toISOString(),
      isActive: false
    };

    const result = await layouts.insertOne(layout);
    res.status(201).json({
      ...layout,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating layout', error });
  }
});

// Set active layout
router.post('/layout/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid layout ID format' });
    }

    // Deactivate current active layout
    await layouts.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    );

    // Activate new layout
    const result = await layouts.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive: true } },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString()
      });
    } else {
      res.status(404).json({ message: 'Layout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error activating layout', error });
  }
});

// Manage sections
router.post('/sections', async (req, res) => {
  try {
    const section: Omit<TableSection, '_id'> = req.body;
    const result = await sections.insertOne(section);
    
    res.status(201).json({
      ...section,
      _id: result.insertedId.toString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating section', error });
  }
});

// Get all sections
router.get('/sections', async (req, res) => {
  try {
    const allSections = await sections.find().toArray();
    const sectionsWithStringIds = allSections.map(section => ({
      ...section,
      _id: section._id.toString()
    }));
    
    res.json(sectionsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections', error });
  }
});

// Update section
router.put('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid section ID format' });
    }

    const updateData: Partial<TableSection> = req.body;
    delete updateData._id;

    const result = await sections.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json({
        ...result,
        _id: result._id.toString()
      });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating section', error });
  }
});

export default router;
