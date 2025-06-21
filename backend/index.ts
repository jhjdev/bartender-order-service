import express, { Express } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectDB } from './config/db';
import { setupSocket } from './socket';
import authRoutes from './routes/auth';
import drinksRoutes from './routes/drinks';
import cocktailsRoutes from './routes/cocktails';
import imageRoutes from './routes/images';
import staffRoutes from './routes/staff';
import ordersRoutes from './routes/orders';
import settingsRoutes from './routes/settings';
import notificationsRoutes from './routes/notifications';
import * as dotenv from 'dotenv';
import { getEnvPath } from './utils/paths';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

const app: Express = express();
const server = createServer(app);
const io = setupSocket(server);

// Make io available to controllers
app.set('io', io);

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
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    websocket: 'enabled',
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is enabled`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
