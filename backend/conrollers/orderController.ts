import { Request, Response } from "express";
import { Order } from "../models/order";

const orders: Order[] = [];

export const orderController = {
  createOrder: (req: Request, res: Response) => {
    const { customerNumber, drinkType, drinkCount } = req.body;

    // Check if customer number already exists
    const existingOrder = orders.find(
      (order) => order.customerNumber === customerNumber
    );
    if (existingOrder) {
      return res
        .status(409)
        .json({ message: "Customer number already exists." });
    }

    // Check if the barman can accept the order
    if (drinkType === "BEER" && drinkCount > 2) {
      return res
        .status(429)
        .json({ message: "Order not accepted at the moment." });
    } else if (drinkType === "DRINK" && drinkCount > 1) {
      return res
        .status(429)
        .json({ message: "Order not accepted at the moment." });
    }

    // Create a new order
    const order: Order = {
      customerNumber,
      drinkType,
      drinkCount,
    };

    orders.push(order);

    // Respond with 200 code
    return res.status(200).json({ message: "Order received." });
  },

  getOrders: (_req: Request, res: Response) => {
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders at the moment." });
    }

    return res.status(200).json({ orders });
  },
};
