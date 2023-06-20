import { useState } from "react";
import { useBetween } from "use-between";

const useOrdersState = () => {
  const [servedDrinks, setServedDrinks] = useState([]);
  const [servedCustomers, setServedCustomers] = useState([]);
  return {
    servedDrinks,
    setServedDrinks,
    servedCustomers,
    setServedCustomers,
  };
};

export const useSharedOrdersState = () => useBetween(useOrdersState);
