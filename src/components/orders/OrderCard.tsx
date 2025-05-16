import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { deleteOrder, calculateOrderTotal } from '../../redux/slices/orderSlice';
import { Order, OrderStatus } from '../../shared/types';
import OrderPayment from './OrderPayment';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.orders);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.READY:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.PAID:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
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
      await dispatch(deleteOrder(order._id!)).unwrap();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete order');
      setDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
      {/* Order Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{order._id?.substring(order._id.length - 6)}
            </h2>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-4">
        {/* Customer Info */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Customer Information</h3>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Table:</span> {order.tableNumber}
            </p>
            {order.customerNumber && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Customer:</span> {order.customerNumber}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Order Items</h3>
          <div className="bg-gray-50 rounded-md p-2">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
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
              <span>${calculateOrderTotal(order).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-4">
          <OrderPayment order={order} />
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
                disabled={loading}
                className={`flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </div>
                ) : (
                  'Confirm Delete'
                )}
              </button>
              <button
                onClick={cancelDelete}
                disabled={loading}
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

