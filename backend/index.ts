import express, { Express } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import drinksRoutes from './routes/drinksRoutes';
import cocktailsRoutes from './routes/cocktailsRoutes';
import imageRoutes from './routes/images';
import staffRoutes from './routes/staffRoutes';
import ordersRoutes from './routes/ordersRoutes';
import * as dotenv from 'dotenv';
import { getEnvPath } from './utils/paths';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drinks', drinksRoutes);
app.use('/api/cocktails', cocktailsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/images', imageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
