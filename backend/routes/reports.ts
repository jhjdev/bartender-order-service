import { Router } from 'express';
import { Collection } from 'mongodb';
import { client } from '../config/db';
import { OrderDocument, OrderItemDocument } from '../types/order';
import { DrinkDocument } from '../types/drink';
import { EmployeeDocument } from '../types/employee';
import { Shift } from '../types/employee';
import { Filter } from 'mongodb';

const router = Router();
const orders = client.db().collection<OrderDocument>('orders');
const drinks = client.db().collection<DrinkDocument>('drinks');
const employees = client.db().collection<EmployeeDocument>('employees');
const shifts = client.db().collection<Shift>('shifts');

// Get daily profits
router.get('/profits/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = date ? new Date(date as string) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const dailyOrders = await orders
      .find({
        createdAt: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
        isPaid: true,
      })
      .toArray();

    const totalProfit = dailyOrders.reduce(
      (sum: number, order: OrderDocument): number => {
        const orderTotal = order.items.reduce(
          (itemSum: number, item: OrderItemDocument): number => {
            return itemSum + item.price * item.quantity;
          },
          0
        );
        return sum + orderTotal;
      },
      0
    );

    res.json({
      date: startDate.toISOString().split('T')[0],
      totalProfit,
      orderCount: dailyOrders.length,
    });
  } catch (error) {
    console.error('Error calculating daily profits:', error);
    res.status(500).json({ message: 'Error calculating daily profits' });
  }
});

// Get profits for a date range
router.get('/profits/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      res.status(400).json({ message: 'Start and end dates are required' });
      return;
    }

    const orders_data = await orders
      .find({
        createdAt: {
          $gte: start as string,
          $lte: end as string,
        },
        isPaid: true,
      })
      .toArray();

    // Group profits by date
    const profitsByDate = orders_data.reduce(
      (
        acc: Record<string, { totalProfit: number; orderCount: number }>,
        order: OrderDocument
      ): Record<string, { totalProfit: number; orderCount: number }> => {
        const date = order.createdAt.split('T')[0];
        const orderTotal = order.items.reduce(
          (sum: number, item: OrderItemDocument): number => {
            return sum + item.price * item.quantity;
          },
          0
        );

        if (!acc[date]) {
          acc[date] = {
            totalProfit: 0,
            orderCount: 0,
          };
        }

        acc[date].totalProfit += orderTotal;
        acc[date].orderCount += 1;
        return acc;
      },
      {} as Record<string, { totalProfit: number; orderCount: number }>
    );

    res.json(profitsByDate);
  } catch (error) {
    console.error('Error calculating profits for range:', error);
    res.status(500).json({ message: 'Error calculating profits for range' });
  }
});

// Get popular items
router.get('/items/popular', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query: Filter<OrderDocument> = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate as string,
        $lte: endDate as string,
      };
    }

    const ordersCollection: Collection<OrderDocument> = client
      .db()
      .collection('orders');
    const orders = await ordersCollection.find(query).toArray();

    // Count drink occurrences
    const drinkCounts = new Map<string, { count: number; name: string }>();
    orders.forEach((order: OrderDocument) => {
      order.items.forEach((item: OrderItemDocument) => {
        const current = drinkCounts.get(item.drinkId.toString()) || {
          count: 0,
          name: item.name,
        };
        drinkCounts.set(item.drinkId.toString(), {
          count: current.count + item.quantity,
          name: current.name,
        });
      });
    });

    // Convert to array and sort by count
    const popularItems = Array.from(drinkCounts.entries())
      .map(([id, data]) => ({
        drinkId: id,
        name: data.name,
        totalSold: data.count,
      }))
      .sort((a, b) => b.totalSold - a.totalSold);

    res.json(popularItems);
  } catch (error) {
    console.error('Error getting popular items:', error);
    res.status(500).json({ message: 'Error getting popular items' });
  }
});

// Get staff performance report
router.get('/staff/performance', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      res.status(400).json({ message: 'Start and end dates are required' });
      return;
    }

    // Get all shifts in the date range
    const shiftsData = await shifts
      .find({
        date: {
          $gte: start as string,
          $lte: end as string,
        },
      })
      .toArray();

    // Get all employees
    const employeesData = await employees.find({ active: true }).toArray();

    // Calculate performance metrics
    const performanceReport = employeesData.map(
      (employee: EmployeeDocument) => {
        const employeeShifts = shiftsData.filter(
          (shift) => shift.employeeId === employee._id.toString()
        );
        const totalShifts = employeeShifts.length;
        const totalHours = employeeShifts.reduce((sum, shift) => {
          const startTime = new Date(`1970-01-01T${shift.startTime}`);
          const endTime = new Date(`1970-01-01T${shift.endTime}`);
          return (
            sum + (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
          );
        }, 0);
        return {
          employeeId: employee._id.toString(),
          name: `${employee.firstName} ${employee.lastName}`,
          jobTitle: employee.jobTitle,
          totalShifts,
          totalHours,
          averageHoursPerShift: totalShifts > 0 ? totalHours / totalShifts : 0,
        };
      }
    );

    res.json(performanceReport);
  } catch (error) {
    console.error('Error generating staff performance report:', error);
    res
      .status(500)
      .json({ message: 'Error generating staff performance report' });
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
        isAvailable: drink.isAvailable,
        price: drink.price,
      });
      return acc;
    }, {} as Record<string, Array<{ _id: string; name: string; isAvailable: boolean; price: number }>>);

    res.json(inventory);
  } catch (error) {
    console.error('Error generating inventory status:', error);
    res.status(500).json({ message: 'Error generating inventory status' });
  }
});

// Get shift coverage report
router.get('/shifts/coverage', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      res.status(400).json({ message: 'Start and end dates are required' });
      return;
    }

    const shiftsData = await shifts
      .find({
        date: {
          $gte: start as string,
          $lte: end as string,
        },
      })
      .toArray();

    // Group shifts by date
    const coverage = shiftsData.reduce((acc, shift) => {
      if (!acc[shift.date]) {
        acc[shift.date] = {
          totalShifts: 0,
          positions: {},
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
    console.error('Error generating shift coverage report:', error);
    res.status(500).json({ message: 'Error generating shift coverage report' });
  }
});

export default router;
