import { useSharedOrdersState } from "../state/totalOrder.state";

export const AddToOrder = () => {
  const { servedDrinks, setServedDrinks, servedCustomers, setServedCustomers } =
    useSharedOrdersState();

  const handleOrder = (customerNumber: number, drinkType: string) => {
    // Send a drink order to the backend
    fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerNumber, drinkType }),
    })
      .then((res) => {
        if (res.ok) {
          // Refresh the served drinks and customers
          fetch("http://localhost:3001/served")
            .then((res) => res.json())
            .then((data) => {
              setServedDrinks(data.servedDrinks);
              setServedCustomers(data.servedCustomers);
            });
        } else {
          console.log("Order not accepted at the moment");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  return (
    <>
      <div className="container mx-auto w-screen">
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
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
        <div className="grid gap-6 mb-6 center-items justify-center">
          <div className="w-10/12 px-4 py-5 bg-white rounded-lg shadow">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  New drink order:
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Fill in customer number, and the amount of beers and drinks
                  you want to order.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <p className="pb-4">
                      <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => handleOrder(1, "BEER")}
                      >
                        Order 1 Beer
                      </button>
                    </p>
                    <p className="pb-4">
                      <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => handleOrder(2, "BEER")}
                      >
                        Order 2 Beer
                      </button>
                    </p>
                    <p className="pb-4">
                      <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => handleOrder(3, "DRINK")}
                      >
                        Order 1 Drink
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <p>Status: </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToOrder;
