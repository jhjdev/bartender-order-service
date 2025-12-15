import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createOrder } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';

const AddOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.orders.loading);
  const [customerNumber, setCustomerNumber] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<number>(1);

  const handleCustomerNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerNumber(event.target.value);
  };

  const handleTableNumberChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTableNumber(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await dispatch(
        createOrder({
          customerNumber,
          tableNumber: `T${tableNumber}`,
          items: [], // Items will be added through drink selection
        })
      ).unwrap();

      toast.success('Order created successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });

      setCustomerNumber('');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="customerNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Number
            </label>
            <input
              type="text"
              id="customerNumber"
              value={customerNumber}
              onChange={handleCustomerNumberChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tableNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Table Number
            </label>
            <select
              id="tableNumber"
              value={tableNumber}
              onChange={handleTableNumberChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Table {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            text={loading ? 'Creating Order...' : 'Create Order'}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
