import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  processOrderPayment,
  calculateOrderTotal,
} from '../../redux/slices/orderSlice';
import { Order } from '../../types/order';
import { showToast } from '../../utils/toast';

interface OrderPaymentProps {
  order: Order;
}

const OrderPayment: React.FC<OrderPaymentProps> = ({
  order,
}: OrderPaymentProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.orders.loading);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isPaid = order.isPaid ?? order.paymentStatus === 'paid';

  const handlePaymentProcess = async () => {
    try {
      setPaymentError(null);
      await dispatch(
        processOrderPayment({
          orderId: order._id!,
          isPaid: !isPaid,
        })
      ).unwrap();
      showToast.success('Payment processed successfully');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Payment processing failed';
      setPaymentError(errorMessage);
      showToast.error(errorMessage);
    }
  };

  const totalAmount = calculateOrderTotal(order);
  const paymentStatus = isPaid ? 'Paid' : 'Unpaid';
  const buttonText = isPaid ? 'Mark as Unpaid' : 'Process Payment';
  const statusColor = isPaid ? 'text-green-600' : 'text-red-600';

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Order Payment
        </h3>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${statusColor}`}>{paymentStatus}</span>
        </div>

        {paymentError && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {paymentError}
          </div>
        )}

        <button
          onClick={handlePaymentProcess}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : isPaid
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Processing...' : buttonText}
        </button>
      </div>
    </div>
  );
};

export default OrderPayment;
