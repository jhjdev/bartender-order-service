import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { OrderStatus } from '../../types/order';
import OrderCard from './OrderCard';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'preparing',
  'ready',
  'served',
  'cancelled',
];

interface OrderError {
  operation: string;
  message: string;
}

const OrderList: React.FC = () => {
  const {
    orders = [],
    loadingStates,
    errors,
  } = useAppSelector((state) => state.orders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  // Filter orders by status
  const filteredOrders = Array.isArray(orders)
    ? statusFilter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === statusFilter)
    : [];

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Handle status filter change
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as OrderStatus | 'ALL');
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4 animate-pulse"
        >
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="bg-gray-50 rounded-md p-2">
                <div className="h-10 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ));
  };

  // Get fetch error if it exists
  const fetchError = (errors as OrderError[]).find(
    (error) => error.operation === 'fetch'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Orders
        </h1>

        <div className="w-full md:w-64">
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Orders</option>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error message */}
      {fetchError && !loadingStates.fetch && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{fetchError.message}</p>
        </div>
      )}

      {/* Loading skeletons */}
      {loadingStates.fetch ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderSkeletons()}
        </div>
      ) : (
        <>
          {/* Orders display */}
          {sortedOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No orders found
              </h3>
              <p className="text-gray-500">
                {statusFilter !== 'ALL'
                  ? `No orders with status "${statusFilter}" available.`
                  : 'There are currently no orders in the system.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
