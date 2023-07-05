// server.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { orderController } from "./conrollers/orderController";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/orders", orderController.createOrder);
app.get("/orders", orderController.getOrders);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
