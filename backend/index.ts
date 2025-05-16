import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRouter from './routes/auth';
import drinksRouter from './routes/drinks';
import cocktailsRouter from './routes/cocktails';
import imagesRouter from './routes/images';
import employeesRouter from './routes/employees';
import shiftsRouter from './routes/shifts';
import reportsRouter from './routes/reports';
import tablesRouter from './routes/tables';
import filesRouter from './routes/files';
import ordersRouter from './routes/orders';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4000'],  // Frontend dev server and backend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/drinks', drinksRouter);
app.use('/api/cocktails', cocktailsRouter);
app.use('/api/images', imagesRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/files', filesRouter);
app.use('/api/orders', ordersRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
