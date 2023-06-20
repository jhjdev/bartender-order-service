import { useEffect } from "react";
import uuid from "react-uuid";
import { useSharedOrdersState } from "../state/totalOrder.state";

export const Orders = () => {
  const { servedDrinks, setServedDrinks, servedCustomers, setServedCustomers } =
    useSharedOrdersState();

  useEffect(() => {
    // Fetch the served drinks and customers from the backend
    fetch("http://localhost:3001/served")
      .then((res) => res.json())
      .then((data) => {
        setServedDrinks(data.servedDrinks);
        setServedCustomers(data.servedCustomers);
      });
  }, []);

  return (
    <>
      <div className="container mx-auto w-screen">
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3 mr-4">
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Customers
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              120,00
            </div>
          </div>
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Profit
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              $ 450k
            </div>
          </div>
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Orders
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">20k</div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 justify-evenly m-8">
          <h2 className="text-2xl text-blue-900">Served Drinks:</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 justify-evenly m-8">
          {servedDrinks.map((drink) => (
            <div key={uuid()} className="rounded-lg">
              <div className="justify-center center-items bg-white dark:bg-gray-950">
                <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 ">
                  <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white dark:bg-gray-900">
                    <div className="flex gap-4 items-center">
                      <p
                        key={uuid()}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {drink}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 justify-evenly m-8">
          <h2 className="text-2xl text-blue-900 pt-5">Served Customers:</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 justify-evenly m-8">
          {servedCustomers.map((customer, index) => (
            <div key={uuid()} className="rounded-lg">
              <div className="justify-center center-items bg-white dark:bg-gray-950">
                <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 ">
                  <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white dark:bg-gray-900">
                    <div className="flex gap-4 items-center">
                      <p
                        key={uuid()}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {customer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
