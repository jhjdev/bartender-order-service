import express, { Express } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
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
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

// Load environment variables from root .env file
dotenv.config({ path: getEnvPath() });

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const server = createServer(app);
const io = setupSocket(server);

// Make io available to controllers
app.set('io', io);

const PORT = process.env.PORT || 3001;
const BODY_LIMIT = process.env.BODY_LIMIT || '100kb';

// Security and parsing middleware
app.use(cors());

// Use the simple query parser to avoid `qs` for query strings
app.set('query parser', 'simple');

// Limit JSON and URL-encoded body sizes to mitigate resource exhaustion
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: BODY_LIMIT }));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from temp-uploads directory
app.use('/temp-uploads', express.static(path.join(__dirname, 'temp-uploads')));

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
