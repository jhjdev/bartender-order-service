import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';
import { Shift, JobTitle } from '../types/employee';

const router = Router();
const shifts = db.collection('shifts');
const timeOff = db.collection('timeOff');
const employees = db.collection('employees');

// Get all shifts within a date range
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;

    const query: Record<string, unknown> = {};
    if (start && end) {
      query.date = {
        $gte: start as string,
        $lte: end as string,
      };
    }

    const allShifts = await shifts.find(query).toArray();

    // Get all relevant employee data in one query
    const employeeIds = [
      ...new Set(allShifts.map((shift) => shift.employeeId)),
    ];
    const employeesData = await employees
      .find({
        _id: { $in: employeeIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    // Create employee lookup map
    const employeeMap = employeesData.reduce<
      Record<
        string,
        { firstName: string; lastName: string; jobTitle: JobTitle }
      >
    >((acc, emp) => {
      acc[emp._id.toString()] = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        jobTitle: emp.jobTitle,
      };
      return acc;
    }, {});

    // Combine shift data with employee details
    const shiftsWithEmployeeInfo = allShifts.map((shift) => ({
      ...shift,
      _id: shift._id.toString(),
      employee: employeeMap[shift.employeeId],
    }));

    res.json(shiftsWithEmployeeInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
});

// Get shifts for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const dayShifts = await shifts.find({ date }).toArray();

    // Get employee details
    const employeeIds = [
      ...new Set(dayShifts.map((shift) => shift.employeeId)),
    ];
    const employeesData = await employees
      .find({
        _id: { $in: employeeIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    const employeeMap = employeesData.reduce<
      Record<
        string,
        { firstName: string; lastName: string; jobTitle: JobTitle }
      >
    >((acc, emp) => {
      acc[emp._id.toString()] = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        jobTitle: emp.jobTitle,
      };
      return acc;
    }, {});

    const shiftsWithEmployeeInfo = dayShifts.map((shift) => ({
      ...shift,
      _id: shift._id.toString(),
      employee: employeeMap[shift.employeeId],
    }));

    res.json(shiftsWithEmployeeInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts for date', error });
  }
});

// Bulk create shifts
router.post('/bulk', async (req, res) => {
  try {
    const shifts_data: Omit<Shift, '_id'>[] = req.body.shifts;

    // Validate shifts for conflicts
    for (const shift of shifts_data) {
      const conflictingShift = await shifts.findOne({
        employeeId: shift.employeeId,
        date: shift.date,
        $or: [
          {
            startTime: { $lte: shift.startTime },
            endTime: { $gt: shift.startTime },
          },
          {
            startTime: { $lt: shift.endTime },
            endTime: { $gte: shift.endTime },
          },
        ],
      });

      if (conflictingShift) {
        res.status(409).json({
          message: 'Shift conflict detected',
          conflictingShift: {
            ...conflictingShift,
            _id: conflictingShift._id.toString(),
          },
        });
        return;
      }
    }

    const result = await shifts.insertMany(shifts_data);

    const insertedShifts = await shifts
      .find({
        _id: { $in: Object.values(result.insertedIds) },
      })
      .toArray();

    res.status(201).json(
      insertedShifts.map((shift) => ({
        ...shift,
        _id: shift._id.toString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Error creating shifts', error });
  }
});

// Update shift
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid shift ID format' });
      return;
    }

    const updateData: Partial<Shift> = req.body;
    delete updateData._id;

    // Check for conflicts if time is being updated
    if (updateData.startTime || updateData.endTime) {
      const existingShift = await shifts.findOne({ _id: new ObjectId(id) });
      if (!existingShift) {
        res.status(404).json({ message: 'Shift not found' });
        return;
      }

      const updateDataObj = {
        employeeId: existingShift.employeeId,
        date: updateData.date || existingShift.date,
        startTime: updateData.startTime || existingShift.startTime,
        endTime: updateData.endTime || existingShift.endTime,
      };

      // Check for overlapping shifts
      const overlappingShift = await shifts.findOne({
        _id: { $ne: new ObjectId(id) },
        employeeId: updateDataObj.employeeId,
        date: updateDataObj.date,
        $or: [
          {
            startTime: { $lte: updateDataObj.startTime },
            endTime: { $gt: updateDataObj.startTime },
          },
          {
            startTime: { $lt: updateDataObj.endTime },
            endTime: { $gte: updateDataObj.endTime },
          },
        ],
      });

      if (overlappingShift) {
        res
          .status(409)
          .json({ message: 'Shift conflicts with existing schedule' });
        return;
      }
    }

    const result = await shifts.findOneAndUpdate(
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
      res.status(404).json({ message: 'Shift not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift', error });
  }
});

// Delete shift
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid shift ID format' });
      return;
    }

    const result = await shifts.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Shift deleted successfully' });
    } else {
      res.status(404).json({ message: 'Shift not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift', error });
  }
});

// Get all time off requests (for schedule planning)
router.get('/time-off', async (req, res) => {
  try {
    const { start, end } = req.query;

    const query: Record<string, unknown> = {};
    if (start && end) {
      query.$or = [
        {
          startDate: { $gte: start as string, $lte: end as string },
        },
        {
          endDate: { $gte: start as string, $lte: end as string },
        },
      ];
    }

    const timeOffRequests = await timeOff.find(query).toArray();

    // Get employee details
    const employeeIds = [
      ...new Set(timeOffRequests.map((req) => req.employeeId)),
    ];
    const employeesData = await employees
      .find({
        _id: { $in: employeeIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    const employeeMap = employeesData.reduce<
      Record<string, { firstName: string; lastName: string }>
    >((acc, emp) => {
      acc[emp._id.toString()] = {
        firstName: emp.firstName,
        lastName: emp.lastName,
      };
      return acc;
    }, {});

    const timeOffWithEmployeeInfo = timeOffRequests.map((request) => ({
      ...request,
      _id: request._id.toString(),
      employee: employeeMap[request.employeeId],
    }));

    res.json(timeOffWithEmployeeInfo);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching time off requests', error });
  }
});

export default router;
