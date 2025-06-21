import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { useSocket } from '../../contexts/SocketContext';
import { deleteOrder } from '../../redux/slices/orderSlice';
import { Order, OrderStatus, OrderNote } from '../../types/order';
import OrderPayment from './OrderPayment';
import OrderNotes from './OrderNotes';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order>(order);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('order:updated', (updatedOrder: Order) => {
      if (updatedOrder._id === currentOrder._id) {
        setCurrentOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('order:updated');
    };
  }, [socket, currentOrder._id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setDeleteError(null);
      await dispatch(deleteOrder(currentOrder._id!)).unwrap();
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete order'
      );
      setDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  const handleAddNote = async (note: Omit<OrderNote, 'timestamp'>) => {
    try {
      // This would typically call an API to add the note
      // For now, we'll just update the local state
      const newNote: OrderNote = {
        ...note,
        _id: Date.now().toString(), // Temporary ID
        timestamp: new Date().toISOString(),
      };

      setCurrentOrder((prev) => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
      {/* Order Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{currentOrder._id?.substring(currentOrder._id.length - 6)}
            </h2>
            <p className="text-sm text-gray-600">
              {formatDate(currentOrder.createdAt)}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                currentOrder.status
              )}`}
            >
              {currentOrder.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-4">
        {/* Customer Info */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Customer Information
          </h3>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Customer:</span>{' '}
              {currentOrder.customerNumber}
            </p>
            {currentOrder.tableNumber && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Table:</span>{' '}
                {currentOrder.tableNumber}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Order Items
          </h3>
          <div className="bg-gray-50 rounded-md p-2">
            <ul className="divide-y divide-gray-200">
              {currentOrder.items.map((item, index) => (
                <li key={item._id || index} className="py-2">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-4">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
              <span>Total</span>
              <span>${currentOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-4">
          <OrderPayment order={currentOrder} />
        </div>

        {/* Order Notes */}
        <div className="mb-4">
          <OrderNotes
            notes={currentOrder.notes}
            onAddNote={handleAddNote}
            currentUser="Current User" // This should come from auth context
          />
        </div>

        {/* Delete Section */}
        <div className="mt-4">
          {deleteError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {deleteError}
            </div>
          )}

          {deleteConfirm ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDeleteOrder}
                className={`flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors`}
              >
                Deleting...
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteOrder}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
            >
              Delete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
