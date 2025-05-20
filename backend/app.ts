import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db';
import staffRoutes from './routes/staffRoutes';
import drinksRoutes from './routes/drinksRoutes';
import cocktailsRoutes from './routes/cocktailsRoutes';
import ordersRoutes from './routes/ordersRoutes';
import authRoutes from './routes/authRoutes';

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
