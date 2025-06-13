import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { connectToDatabase } from './db';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import staffRoutes from './routes/staff';
import drinksRoutes from './routes/drinks';
import cocktailsRoutes from './routes/cocktails';
import ordersRoutes from './routes/orders';
import authRoutes from './routes/auth';
import testRoutes from './routes/test';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/drinks', drinksRoutes);
app.use('/api/cocktails', cocktailsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/test', testRoutes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  next; // no-op to satisfy linter

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(422).json({
      status: 422,
      message: 'Validation error',
      details: err.details,
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: 401,
      message: 'Invalid token',
    });
    return;
  }

  // Default error
  res.status(500).json({
    status: 500,
    message: 'Internal server error',
  });
};

app.use(errorHandler);

// Connect to database
connectToDatabase();

export default app;
