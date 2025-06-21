import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room for real-time updates
    socket.on('join:orders', () => {
      socket.join('orders');
      console.log(`Client ${socket.id} joined orders room`);
    });

    socket.on('join:notifications', () => {
      socket.join('notifications');
      console.log(`Client ${socket.id} joined notifications room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
