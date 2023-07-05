import { useSharedOrdersState } from "../state/totalOrder.state";
import InfoCard from "../components/InfoCard";
import Card from "../components/Card";
import { useEffect } from "react";

export const Orders = () => {
  const { orders, setOrders, error, setError, customerNumber } =
    useSharedOrdersState();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/orders");
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (error) {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <>
      <div className="container max-w-full mt-4">
        <div className="grid grid-cols-1 gap-6 mb-10 lg:grid-cols-3">
          <InfoCard headline="Total Customers" text={customerNumber.length} />
          <InfoCard headline="Total Profit" text={"$ " + 450 + "k"} />
          <InfoCard headline="Total Orders" text={20 + "k"} />
        </div>
        <div className="grid grid-cols-1 gap-4 justify-evenly m-2">
          <h2 className="text-2xl text-blue-900 dark:text-white">
            Served Drinks:
          </h2>
        </div>
        {error ? (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            <p>Error fetching orders</p>) : orders.length === 0 ? (
            <p>No orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 justify-evenly m-2">
            {orders.map((order, index) => (
              <Card
                key={index}
                customerNumber={order.customerNumber}
                drinkType={order.drinkType}
                drinkCount={order.drinkCount}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
