import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import InfoCard from "../components/InfoCard";
import { RootState } from "../redux/store";
import { fetchOrders } from "../redux/slices/orderSlice";
import OrderList from "../components/orders/OrderList";
import { useNavigate } from "react-router-dom";
import { Order } from "../shared/types"; // Make sure this import points to your Order type definition

export const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useAppSelector((state: RootState) => state.orders);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Default to false for better UX
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // Track auth loading state

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      // Redirect to login page if you have one
      // navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false); // Authentication check is complete
  }, [navigate]);

  // Fetch orders data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  // Calculate order statistics with proper error handling and TypeScript types
  interface OrderStats {
    totalDrinks: number;
    totalProfit: number;
    totalOrders: number;
  }

  const orderStats: OrderStats = useMemo(() => {
    try {
      // Default values in case of empty orders or error
      if (!orders || orders.length === 0) {
        return { totalDrinks: 0, totalProfit: 0, totalOrders: 0 };
      }

      // Calculate total drinks with error handling
      const totalDrinks = orders.reduce((sum, order) => {
        // Check if order and items exist to prevent errors
        if (!order || !order.items) return sum;
        return sum + order.items.reduce((itemSum, item) => {
          return itemSum + (item?.quantity || 0);
        }, 0);
      }, 0);

      // Calculate total profit with error handling
      const totalProfit = orders.reduce((sum, order) => {
        return sum + (order?.total || 0);
      }, 0);

      return {
        totalDrinks,
        totalProfit,
        totalOrders: orders.length
      };
    } catch (error) {
      console.error("Error calculating order statistics:", error);
      return { totalDrinks: 0, totalProfit: 0, totalOrders: 0 };
    }
  }, [orders]);

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect or show auth required message
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to view this page.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders Dashboard</h1>
          
          {/* Unified Loading Indicator */}
          {loading && (
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Refreshing data...</span>
            </div>
          )}
        </div>
        
        {/* Error state for failed data fetch */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">Error loading orders data. Please try again.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <InfoCard 
            headline="Total Orders" 
            text={orderStats.totalOrders.toString()}
            loading={loading} 
          />
          <InfoCard 
            headline="Total Drinks Served" 
            text={orderStats.totalDrinks.toString()}
            loading={loading} 
          />
          <InfoCard 
            headline="Total Revenue" 
            text={`$ ${orderStats.totalProfit.toFixed(2)}`}
            loading={loading} 
          />
        </div>
      </div>

      {/* Orders List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Orders Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and view all customer orders
          </p>
        </div>
        
        <div className="p-2 md:p-4">
          {/* Include the OrderList component */}
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default Orders;
