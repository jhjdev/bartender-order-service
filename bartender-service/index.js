import express from "express";
import http from "http";
import cors from "cors";
import { createTerminus } from "@godaddy/terminus";

const app = express();

const server = http.createServer(app);

// Store the served drinks and customers in memory
let servedDrinks = [];
let servedCustomers = [];

// Configurable value for drink preparation time in seconds
const preparationTime = 5;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Prevent CORS errors
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Endpoint to accept drink orders
app.post("/orders", (req, res) => {
  const { customerNumber, drinkType } = req.body;

  // Check if the barman can accept the order
  if (drinkType === "BEER" && servedDrinks.length >= 2) {
    res.status(429).send("Cannot accept order at the moment");
  } else if (drinkType === "DRINK" && servedDrinks.length >= 1) {
    res.status(429).send("Cannot accept order at the moment");
  } else {
    // Add the order to the served drinks and customers
    servedDrinks.push(drinkType);
    servedCustomers.push(customerNumber);

    // Simulate drink preparation time (asynchronous)
    setTimeout(() => {
      // Remove the served drink and customer from the list
      servedDrinks = servedDrinks.filter((drink) => drink !== drinkType);
      servedCustomers = servedCustomers.filter(
        (customer) => customer !== customerNumber
      );

      // Log the completed order
      console.log(
        `[${new Date().toISOString()}] Drink served: ${drinkType} for customer ${customerNumber}`
      );

      // Send the response immediately, as the drink is being prepared
      res.sendStatus(200);
    }, preparationTime * 1000);
  }
});

// Endpoint to list served drinks and customers
app.get("/served", (req, res) => {
  res.json({ servedDrinks, servedCustomers });
});

const onSignal = () => {
  console.log("server is starting cleanup");
  return Promise.all([
    // your clean logic, like closing database connections
  ]);
};

const onShutdown = () => {
  console.log("cleanup finished, server is shutting down");
};

const healthCheck = ({ state }) => {
  // `state.isShuttingDown` (boolean) shows whether the server is shutting down or not
  return Promise
    .resolve
    // optionally include a resolve value to be included as
    // info in the health check response
    ();
};

createTerminus(server, {
  signal: "SIGINT",
  healthChecks: { "/healthcheck": healthCheck },
  onSignal,
  onShutdown,
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
