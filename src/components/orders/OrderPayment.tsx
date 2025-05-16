import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { processOrderPayment, calculateOrderTotal } from '../../redux/slices/orderSlice';
import { Order } from '../../../shared/types';

interface OrderPaymentProps {
  order: Order;
}

const OrderPayment: React.FC<OrderPaymentProps> = ({ order }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.orders);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentProcess = async () => {
    try {
      setPaymentError(null);
      await dispatch(processOrderPayment({ 
        orderId: order._id!, 
        isPaid: !order.isPaid 
      })).unwrap();
    } catch (err: any) {
      setPaymentError(err.message || 'Payment processing failed');
    }
  };

  const totalAmount = calculateOrderTotal(order);
  const paymentStatus = order.isPaid ? 'Paid' : 'Unpaid';
  const buttonText = order.isPaid ? 'Mark as Unpaid' : 'Process Payment';
  const statusColor = order.isPaid ? 'text-green-600' : 'text-red-600';

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Payment</h3>
        
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

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          onClick={handlePaymentProcess}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            order.isPaid
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderPayment;

