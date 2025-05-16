import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { client } from '../config/db';

const router = Router();
const orders = client.db().collection('orders');
const drinks = client.db().collection('drinks');
const employees = client.db().collection('employees');
const shifts = client.db().collection('shifts');

// Get daily profits
router.get('/profits/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = date ? new Date(date as string) : new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const dailyOrders = await orders.find({
      createdAt: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      },
      isPaid: true
    }).toArray();

    const totalProfit = dailyOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    res.json({
      date: startDate.toISOString().split('T')[0],
      totalProfit,
      orderCount: dailyOrders.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating daily profits', error });
  }
});

// Get profits for a date range
router.get('/profits/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const orders_data = await orders.find({
      createdAt: {
        $gte: start as string,
        $lte: end as string
      },
      isPaid: true
    }).toArray();

    // Group profits by date
    const profitsByDate = orders_data.reduce((acc, order) => {
      const date = order.createdAt.split('T')[0];
      const orderTotal = order.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      if (!acc[date]) {
        acc[date] = {
          totalProfit: 0,
          orderCount: 0
        };
      }

      acc[date].totalProfit += orderTotal;
      acc[date].orderCount += 1;
      return acc;
    }, {} as Record<string, { totalProfit: number; orderCount: number }>);

    res.json(profitsByDate);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating profits for range', error });
  }
});

// Get popular items
router.get('/items/popular', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query: any = { isPaid: true };
    
    if (start && end) {
      query.createdAt = {
        $gte: start as string,
        $lte: end as string
      };
    }

    const orders_data = await orders.find(query).toArray();

    // Count item sales
    const itemSales: Record<string, { count: number; revenue: number }> = {};
    orders_data.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.drinkId]) {
          itemSales[item.drinkId] = { count: 0, revenue: 0 };
        }
        itemSales[item.drinkId].count += item.quantity;
        itemSales[item.drinkId].revenue += item.price * item.quantity;
      });
    });

    // Get drink details for the sold items
    const drinkIds = Object.keys(itemSales);
    const drinksData = await drinks.find({
      _id: { $in: drinkIds.map(id => new ObjectId(id)) }
    }).toArray();

    // Combine sales data with drink details
    const salesReport = drinksData.map(drink => ({
      _id: drink._id.toString(),
      name: drink.name,
      category: drink.category,
      salesCount: itemSales[drink._id.toString()].count,
      revenue: itemSales[drink._id.toString()].revenue
    })).sort((a, b) => b.salesCount - a.salesCount);

    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: 'Error generating popular items report', error });
  }
});

// Get staff performance report
router.get('/staff/performance', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    // Get all shifts in the date range
    const shiftsData = await shifts.find({
      date: {
        $gte: start as string,
        $lte: end as string
      }
    }).toArray();

    // Get all employees
    const employeesData = await employees.find({ active: true }).toArray();

    // Calculate performance metrics
    const performanceReport = employeesData.map(employee => {
      const employeeShifts = shiftsData.filter(
        shift => shift.employeeId === employee._id.toString()
      );

      const totalHours = employeeShifts.reduce((sum, shift) => {
        const startTime = new Date(`${shift.date}T${shift.startTime}`);
        const endTime = new Date(`${shift.date}T${shift.endTime}`);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);

      return {
        employeeId: employee._id.toString(),
        name: `${employee.firstName} ${employee.lastName}`,
        jobTitle: employee.jobTitle,
        totalShifts: employeeShifts.length,
        totalHours: Math.round(totalHours * 10) / 10,
        averageHoursPerShift: employeeShifts.length 
          ? Math.round((totalHours / employeeShifts.length) * 10) / 10 
          : 0
      };
    });

    res.json(performanceReport);
  } catch (error) {
    res.status(500).json({ message: 'Error generating staff performance report', error });
  }
});

// Get inventory status (most/least stocked items)
router.get('/inventory/status', async (req, res) => {
  try {
    const drinksData = await drinks.find().toArray();
    
    // Group drinks by category
    const inventory = drinksData.reduce((acc, drink) => {
      if (!acc[drink.category]) {
        acc[drink.category] = [];
      }
      acc[drink.category].push({
        _id: drink._id.toString(),
        name: drink.name,
        available: drink.available,
        price: drink.price
      });
      return acc;
    }, {} as Record<string, any[]>);

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory status', error });
  }
});

// Get shift coverage report
router.get('/shifts/coverage', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const shiftsData = await shifts.find({
      date: {
        $gte: start as string,
        $lte: end as string
      }
    }).toArray();

    // Group shifts by date
    const coverage = shiftsData.reduce((acc, shift) => {
      if (!acc[shift.date]) {
        acc[shift.date] = {
          totalShifts: 0,
          positions: {}
        };
      }
      
      acc[shift.date].totalShifts++;
      if (!acc[shift.date].positions[shift.position]) {
        acc[shift.date].positions[shift.position] = 0;
      }
      acc[shift.date].positions[shift.position]++;
      
      return acc;
    }, {} as Record<string, { totalShifts: number; positions: Record<string, number> }>);

    res.json(coverage);
  } catch (error) {
    res.status(500).json({ message: 'Error generating shift coverage report', error });
  }
});

export default router;
