import { ObjectId } from 'mongodb';
import { connectDB, db } from '../config/db';

interface SeedOrder {
  customerNumber: string;
  tableNumber?: string;
  staffId?: ObjectId;
  items: {
    _id: ObjectId;
    drinkId: ObjectId;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'split';
  notes: {
    _id: ObjectId;
    text: string;
    author: string;
    timestamp: Date;
    category: 'allergy' | 'special_request' | 'general';
  }[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const generateRandomOrders = async (): Promise<SeedOrder[]> => {
  // Get drinks from database
  const drinks = await db.collection('drinks').find({}).toArray();
  const staff = await db.collection('staff').find({}).toArray();

  if (drinks.length === 0) {
    console.log('No drinks found. Please seed drinks first.');
    return [];
  }

  if (staff.length === 0) {
    console.log('No staff found. Please seed staff first.');
    return [];
  }

  const orders: SeedOrder[] = [];
  const statuses: Array<'pending' | 'in_progress' | 'completed' | 'cancelled'> =
    ['pending', 'in_progress', 'completed', 'cancelled'];
  const paymentStatuses: Array<'unpaid' | 'partially_paid' | 'paid'> = [
    'unpaid',
    'partially_paid',
    'paid',
  ];
  const paymentMethods: Array<'cash' | 'card' | 'split'> = [
    'cash',
    'card',
    'split',
  ];

  // Generate orders for the last 7 days
  for (let i = 0; i < 50; i++) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 7));
    createdAt.setHours(Math.floor(Math.random() * 24));
    createdAt.setMinutes(Math.floor(Math.random() * 60));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentStatus =
      paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    // Generate 1-5 items per order
    const numItems = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const drink = drinks[Math.floor(Math.random() * drinks.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = drink.price * quantity;
      totalAmount += itemTotal;

      items.push({
        _id: new ObjectId(),
        drinkId: drink._id,
        name: drink.name,
        quantity,
        price: drink.price,
        notes: Math.random() > 0.8 ? 'Extra ice please' : undefined,
      });
    }

    // Generate notes for some orders
    const notes = [];
    if (Math.random() > 0.6) {
      const noteCategories: Array<'allergy' | 'special_request' | 'general'> = [
        'allergy',
        'special_request',
        'general',
      ];
      const noteTexts = [
        'Customer allergic to nuts',
        'No garnish please',
        'Extra spicy',
        'Light on the ice',
        'Double shot',
        'Customer prefers red wine',
        'Table 5 is celebrating birthday',
        'VIP customer - extra attention',
      ];

      const numNotes = Math.floor(Math.random() * 2) + 1;
      for (let k = 0; k < numNotes; k++) {
        notes.push({
          _id: new ObjectId(),
          text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
          author: staff[Math.floor(Math.random() * staff.length)].name,
          timestamp: new Date(createdAt.getTime() + Math.random() * 3600000), // Within 1 hour
          category:
            noteCategories[Math.floor(Math.random() * noteCategories.length)],
        });
      }
    }

    const order: SeedOrder = {
      customerNumber: `CUST${String(i + 1).padStart(3, '0')}`,
      tableNumber:
        Math.random() > 0.3
          ? `T${Math.floor(Math.random() * 20) + 1}`
          : undefined,
      staffId: staff[Math.floor(Math.random() * staff.length)]._id,
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status,
      paymentStatus,
      paymentMethod: paymentStatus === 'paid' ? paymentMethod : undefined,
      notes,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 3600000),
      completedAt:
        status === 'completed'
          ? new Date(createdAt.getTime() + Math.random() * 7200000)
          : undefined,
    };

    orders.push(order);
  }

  return orders;
};

const seedOrders = async () => {
  try {
    await connectDB();

    // Clear existing orders
    const deleteResult = await db.collection('orders').deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing orders`);

    // Generate new orders
    const orders = await generateRandomOrders();

    if (orders.length === 0) {
      console.log(
        'No orders generated. Please ensure drinks and staff are seeded first.'
      );
      return;
    }

    // Insert orders
    const insertResult = await db.collection('orders').insertMany(orders);
    console.log(`Successfully seeded ${insertResult.insertedCount} orders`);

    // Log some statistics
    const stats = await db
      .collection('orders')
      .aggregate([
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

    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\n--- Order Statistics ---');
      console.log(`Total Orders: ${stat.totalOrders}`);
      console.log(`Total Revenue: $${stat.totalRevenue.toFixed(2)}`);
      console.log(`Average Order Value: $${stat.averageOrderValue.toFixed(2)}`);
      console.log(`Pending Orders: ${stat.pendingOrders}`);
      console.log(`In Progress Orders: ${stat.inProgressOrders}`);
      console.log(`Completed Orders: ${stat.completedOrders}`);
      console.log(`Paid Orders: ${stat.paidOrders}`);
      console.log('--- End Statistics ---\n');
    }

    console.log('Order seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

// Run the seeding script
seedOrders();
