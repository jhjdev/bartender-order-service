import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Order } from '../types/order';
import { toast } from 'react-toastify';

const NotificationSystem: React.FC = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('order:created', (order: Order) => {
      toast.info(
        `New order #${order._id?.substring(order._id.length - 6)} from ${
          order.customerNumber
        }`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    });

    socket.on('order:updated', (order: Order) => {
      toast.info(
        `Order #${order._id?.substring(order._id.length - 6)} status: ${
          order.status
        }`,
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    });

    socket.on('order:deleted', ({ id }: { id: string }) => {
      toast.warning(`Order #${id.substring(id.length - 6)} deleted`, {
        position: 'top-right',
        autoClose: 3000,
      });
    });

    return () => {
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('order:deleted');
    };
  }, [socket]);

  return null; // This component doesn't render anything visible
};

export default NotificationSystem;
