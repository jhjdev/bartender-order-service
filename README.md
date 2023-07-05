# A Bartender Service Dashboard

A simple bartender order service dashboard where you can send drink orders to a NodeJS API, and then view all sent orders in a ReactJS frontend.

## Run Locally

Clone the project

```bash
  git clone https://github.com/jhjdev/bartender-order-service/
```

Go to the project directory

```bash
  cd bartender-order-service
```

Install dependencies

```bash
yarn
```

Start the server

```bash
yarn start
```

**Yarn start will also start the NodeJS backend on port 4000.**

## Features and requirements:

- The service accepts a POST requests with customer number and drink type (BEER|DRINK) and:
  - Responds with 200 code when ordered drink will be served.
  - Responds with 429 code when order is not accepted at the moment.
  - Respond with 409 code if a customer number already exists.
- When a post request is made, it is stored in the API.
- The NodeJS Typescript API is separated into:
  - index.ts (NodeJS server)
  - orderController.ts (controller)
  - order.ts (modal)
- The Dashboard ReactJS Typescript Dashboard includes two components at the moment:

  - AddOrder.tsx (where you can create a new order).
  - Orders.tsx (where you can view orders that have been created).

- The barman can prepare at once 2 beers (drinks of BEER type) or 1 drink (DRINK type)
- Preparing one drink takes X seconds (5 by default) regardless of drink type.
- Drink requess get the response as soon as barman starts to prepare a drink. It is be delayed for the time of the drink preparation.
- Each drink order contains a customer number, a drink type, and number of drinks ordered.
- Each order is grouped in a from request that posts the order to the API.
- Each order can either include 1 or two drinks of type BEER, or 1 drink of type DRINK. but never both types. You can choose drink of type BEER 2 times.
- Customer numbers must be unique. If you try to enter the same customer number twice, a message with the status code 409 will appear.

#### See the Roadmap section for list of improvements and changes.

## Roadmap

- Full CRUD implementation, with update and delete functionality as well.

- Add price option to each order that will be stored in the API.

- Add total price of all orders in the info cards at the top.

- Add total amount of all drink orders to API.

- Add total amount of all drink ordres in the info cards at at the top.

- Cleanup Tailwind CSS classes

- Add a notification service that will display when an order is created, updated or deleted.

- Add a login page with JWT authentication.

- Add a settings page where you can:
  - Adjust the amount of drinks of types BEER and DRINK per order (currently set to max 2 of drink type BEER or 1 of drink tyoe DRINK)
  - Add configuration for preparation time (currently set to 5 by default).

## Tech Stack

**Client:** TypeScript, React

**Server:** Node, Express
