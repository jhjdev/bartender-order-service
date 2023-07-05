import { useSharedOrdersState } from "../state/totalOrder.state";

export const FetchOrders = async () => {
  const {
    servedDrinks,
    setServedDrinks,
    customerNumbers,
    setCustomerNumbers,
    statusCode,
    setStatusCode,
    beerCount,
    setBeerCount,
    drinkCountTotal,
    setDrinkCountTotal,
  } = useSharedOrdersState();
  try {
    const response = await fetch("/orders");
    const { servedDrinks, customerNumbers } = await response.json();
    setServedDrinks(servedDrinks);
    setCustomerNumbers(customerNumbers);
    setStatusCode(response.status);

    // Calculate the total count of drinks
    const beerCount = servedDrinks.reduce(
      (count: number, order: { drinkType: string }) =>
        order.drinkType === "BEER" ? count + 1 : count,
      0
    );
    const drinkCount = servedDrinks.length - beerCount;
    setBeerCount(beerCount);
    setDrinkCountTotal(drinkCount);
  } catch (error) {
    console.log("Error:", error);
  }
};
