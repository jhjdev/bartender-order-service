import { useState } from "react";
import { useBetween } from "use-between";

interface Order {
  id: number;
  customerNumber: string;
  drinkType: string;
  drinkCount: number;
}

const useOrdersState = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [drinkType, setDrinkType] = useState<"BEER" | "DRINK">("BEER");
  const [drinkCount, setDrinkCount] = useState(1);
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);
  return {
    drinkType,
    setDrinkType,
    customerNumber,
    setCustomerNumber,
    status,
    setStatus,
    drinkCount,
    setDrinkCount,
    orders,
    setOrders,
    error,
    setError,
  };
};

export const useSharedOrdersState = () => useBetween(useOrdersState);
