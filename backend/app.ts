import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db';
import staffRoutes from './routes/staff';
import drinksRoutes from './routes/drinks';
import cocktailsRoutes from './routes/cocktails';
import ordersRoutes from './routes/orders';
import authRoutes from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/drinks', drinksRoutes);
app.use('/api/cocktails', cocktailsRoutes);
app.use('/api/orders', ordersRoutes);

// Connect to database
connectToDatabase();

export default app;
