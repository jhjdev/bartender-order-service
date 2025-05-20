import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Button from '../../components/Button';
import InfoCard from '../../components/InfoCard';
import { createOrder, fetchOrders } from '../../redux/slices/orderSlice';
import { RootState } from '../../redux/store';
import { Order } from '../../types/order';

const AddOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    orders = [],
    loadingStates,
    errors,
  } = useAppSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const [customerNumber, setCustomerNumber] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [status, setStatus] = useState<string>('');

  const isLoading = loadingStates.create || false;
  const error = errors.find((e) => e.operation === 'create')?.message;

  const totalDrinks =
    orders?.reduce((sum: number, order: Order) => {
      return (
        sum +
        (order.items?.reduce(
          (itemSum: number, item) => itemSum + item.quantity,
          0
        ) || 0)
      );
    }, 0) || 0;

  const totalProfit =
    orders?.reduce((sum: number, order: Order) => {
      return sum + (order.total || 0);
    }, 0) || 0;

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
          tableNumber,
          items: [], // Items will be added through drink selection
        })
      ).unwrap();

      setStatus('Order created successfully');
      setCustomerNumber('');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create order';
      setStatus(errorMessage);
    }
  };

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          <InfoCard
            headline="Total Number of Orders"
            text={orders.length.toString()}
          />
          <InfoCard
            headline="Total Number of Drinks"
            text={totalDrinks.toString()}
          />
          <InfoCard
            headline="Total Profit"
            text={`$ ${totalProfit.toFixed(2)}`}
          />
        </div>
        <div className="w-full grid gap-6 mb-6">
          <div className="w-7/12 px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow flex-col mx-auto">
            <div className="space-y-12">
              <div className="tw-border-solid border-b-2 border-cyan-700 shadow-cyan-700/50 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  New Order:
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Create a new order by entering a customer number and selecting
                  a table.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="customerNumber"
                          >
                            Customer Number:
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            placeholder="Customer Number"
                            type="text"
                            id="customerNumber"
                            value={customerNumber}
                            onChange={handleCustomerNumberChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="tableNumber"
                          >
                            Table Number:
                          </label>
                          <div className="relative">
                            <select
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="tableNumber"
                              value={tableNumber}
                              onChange={handleTableNumberChange}
                              required
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (num) => (
                                  <option key={num} value={num}>
                                    Table {num}
                                  </option>
                                )
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        text={isLoading ? 'Creating Order...' : 'Create Order'}
                        disabled={isLoading}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {(status || error) && (
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <p className={`text-${error ? 'red' : 'green'}-600`}>
                  {status || error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOrder;
