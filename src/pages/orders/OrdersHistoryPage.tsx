import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import InfoCard from '../../components/ui/InfoCard';
import { RootState } from '../../redux/store';
import { fetchOrders } from '../../redux/slices/ordersSlice';
import OrderList from '../../components/orders/OrderList';
import { useTranslation } from 'react-i18next';

const OrdersHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    orders = [],
    loading,
    error,
  } = useAppSelector((state: RootState) => state.orders);
  const { isAuthenticated, loading: authLoading } = useAppSelector(
    (state: RootState) => state.auth
  );

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

  const stats: OrderStats = useMemo(() => {
    if (!Array.isArray(orders)) {
      return {
        totalDrinks: 0,
        totalProfit: 0,
        totalOrders: 0,
      };
    }

    return orders.reduce(
      (acc, order) => {
        const orderTotal = order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        return {
          totalDrinks: acc.totalDrinks + order.items.length,
          totalProfit: acc.totalProfit + orderTotal,
          totalOrders: acc.totalOrders + 1,
        };
      },
      { totalDrinks: 0, totalProfit: 0, totalOrders: 0 }
    );
  }, [orders]);

  // Filter orders to show only history (served or cancelled)
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) {
      return [];
    }

    return orders.filter(
      (order) => order.status === 'served' || order.status === 'cancelled'
    );
  }, [orders]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          {t('common.error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="h1">{t('orders.history.title')}</h1>

          {loading && (
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
              <svg
                className="animate-spin h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm font-medium">
                {t('common.refreshing')}
              </span>
            </div>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard
            headline={t('orders.stats.totalOrders')}
            text={stats.totalOrders.toString()}
          />
          <InfoCard
            headline={t('orders.stats.totalDrinks')}
            text={stats.totalDrinks.toString()}
          />
          <InfoCard
            headline={t('orders.stats.totalProfit')}
            text={`$${stats.totalProfit.toFixed(2)}`}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('orders.history.subtitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('orders.history.description')}
          </p>
        </div>

        <div className="p-2 md:p-4">
          <OrderList initialOrders={filteredOrders} />
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
