import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../config/db';
import { Employee, TimeOff, Shift } from '../types/employee';

const router = Router();
const employees = db.collection('employees');
const timeOff = db.collection('timeOff');
const shifts = db.collection('shifts');

// Get all employees
router.get('/', async (_req, res) => {
  try {
    const allEmployees = await employees.find().toArray();
    const employeesWithStringIds = allEmployees.map((emp) => ({
      ...emp,
      _id: emp._id.toString(),
    }));
    res.json(employeesWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    const employee = await employees.findOne({ _id: new ObjectId(id) });
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    res.json({
      ...employee,
      _id: employee._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
});

// Add new employee
router.post('/', async (req, res) => {
  try {
    const employee: Omit<Employee, '_id'> = {
      ...req.body,
      active: true,
      startDate: new Date().toISOString(),
    };

    const result = await employees.insertOne(employee);
    res.status(201).json({
      ...employee,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    const updateData: Partial<Employee> = req.body;
    delete updateData._id;

    const result = await employees.findOneAndUpdate(
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
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// Time off requests
router.post('/:id/time-off', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    const timeOffRequest: Omit<TimeOff, '_id'> = {
      ...req.body,
      employeeId: id,
      approved: false,
      requestDate: new Date().toISOString(),
    };

    const result = await timeOff.insertOne(timeOffRequest);
    res.status(201).json({
      ...timeOffRequest,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating time off request', error });
  }
});

// Get employee's time off requests
router.get('/:id/time-off', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    const requests = await timeOff.find({ employeeId: id }).toArray();
    const requestsWithStringIds = requests.map((req) => ({
      ...req,
      _id: req._id.toString(),
    }));

    res.json(requestsWithStringIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching time off requests', error });
  }
});

// Assign shift
router.post('/:id/shifts', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    // Check if employee exists
    const employee = await employees.findOne({ _id: new ObjectId(id) });
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    const shift: Omit<Shift, '_id'> = {
      ...req.body,
      employeeId: id,
    };

    // Check for conflicting shifts
    const conflictingShift = await shifts.findOne({
      employeeId: id,
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
      res
        .status(409)
        .json({ message: 'Shift conflicts with existing schedule' });
      return;
    }

    const result = await shifts.insertOne(shift);
    res.status(201).json({
      ...shift,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning shift', error });
  }
});

// Get employee's shifts
router.get('/:id/shifts', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid employee ID format' });
      return;
    }

    const employeeShifts = await shifts.find({ employeeId: id }).toArray();
    const shiftsWithStringIds = employeeShifts.map((shift) => ({
      ...shift,
      _id: shift._id.toString(),
    }));

    res.json(shiftsWithStringIds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
});

export default router;
