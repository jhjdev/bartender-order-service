import { useSharedOrdersState } from "../state/totalOrder.state";
import Button from "../components/Button";
import InfoCard from "../components/InfoCard";

export const AddToOrder = () => {
  const {
    drinkType,
    setDrinkType,
    customerNumber,
    setCustomerNumber,
    status,
    setStatus,
    drinkCount,
    setDrinkCount,
  } = useSharedOrdersState();

  const handleCustomerNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerNumber(event.target.value);
  };

  const handleDrinkTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDrinkType(event.target.value as "BEER" | "DRINK");
  };

  const handleDrinkCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDrinkCount(parseInt(event.target.value, 10));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerNumber,
          drinkType,
          drinkCount,
        }),
      });

      if (response.ok) {
        setStatus("Order placed successfully");
      } else if (response.status === 409) {
        setStatus("Customer number already exists");
        // Handle 409 Conflict error if needed
      } else if (response.status === 429) {
        setStatus("Order not accepted at the moment");
        // Handle 429 Too Many Requests error if needed
      } else {
        setStatus("Failed to place order");
        // Handle other errors if needed
      }
    } catch (error) {
      console.error(error); // Optional: Handle error
    }
  };

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          <InfoCard headline="Total Customers" text={customerNumber.length} />
          <InfoCard headline="Total Profit" text={"$ " + 450 + "k"} />
          <InfoCard headline="Total Orders" text={20 + "k"} />
        </div>
        <div className="w-full grid gap-6 mb-6">
          <div className="w-7/12 px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow flex-col mx-auto">
            <div className="space-y-12">
              <div className="tw-border-solid border-b-2 border-cyan-700 shadow-cyan-700/50 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  New drink order:
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Fill in customer number, and the amount of beers and drinks
                  you want to order. <br />
                  <span className="text-red-600">
                    Please note that you can order a maximum of 2 drinks of type
                    BEER in one order or one drink of type DRINK.
                  </span>
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
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="drinkType"
                          >
                            Drink Type:
                          </label>
                          <div className="relative">
                            <select
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="drinkType"
                              value={drinkType}
                              onChange={handleDrinkTypeChange}
                            >
                              <option value="BEER">Beer</option>
                              <option value="DRINK">Drink</option>
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
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="drinkCount"
                          >
                            Drink Count:
                          </label>
                          <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            type="number"
                            id="drinkCount"
                            value={drinkCount}
                            onChange={handleDrinkCountChange}
                          />
                        </div>
                      </div>
                      <Button type="submit" text="Place Order" />
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              {Number(status) !== 0 && (
                <p className="dark:text-gray-600 text-gray-600">
                  Status Code:
                  <span
                    className={
                      status === "Order not accepted at the moment" ||
                      status === "Failed to place order" ||
                      status === "Customer number already exists"
                        ? "dark:text-red-600 text-red-600"
                        : "dark:text-green-600 text-green-600"
                    }
                  >
                    {status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToOrder;
