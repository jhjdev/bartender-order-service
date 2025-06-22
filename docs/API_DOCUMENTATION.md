# Order System API Documentation

## Overview

This document provides comprehensive documentation for the Order System API endpoints. All endpoints require authentication via JWT token in the Authorization header.

**Base URL**: `http://localhost:4000/api`

**Authentication**: Include `Authorization: Bearer <token>` header

## Order Endpoints

### 1. Create Order

**POST** `/orders`

Creates a new order with items and optional notes.

#### Request Body

```json
{
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "drinkId": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "notes": "Extra ice please"
    }
  ],
  "notes": [
    {
      "text": "Customer allergic to nuts",
      "author": "John Doe",
      "category": "allergy"
    }
  ]
}
```

#### Response (201 Created)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "drinkId": "507f1f77bcf86cd799439012",
      "name": "Mojito",
      "quantity": 2,
      "price": 12.5,
      "notes": "Extra ice please"
    }
  ],
  "totalAmount": 25.0,
  "status": "pending",
  "paymentStatus": "unpaid",
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "text": "Customer allergic to nuts",
      "author": "John Doe",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "category": "allergy"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Validation Rules

- `customerNumber`: Required, non-empty string
- `items`: Required, array with at least one item
- `drinkId`: Valid MongoDB ObjectId
- `quantity`: Positive number greater than 0

### 2. Get Orders (with filtering)

**GET** `/orders`

Retrieves orders with advanced filtering and pagination.

#### Query Parameters

- `status`: Filter by order status (pending, in_progress, completed, cancelled)
- `paymentStatus`: Filter by payment status (unpaid, partially_paid, paid)
- `staffId`: Filter by staff member ID
- `tableNumber`: Filter by table number
- `customerNumber`: Search customer number (case-insensitive)
- `startDate`: Filter orders created after this date (ISO string)
- `endDate`: Filter orders created before this date (ISO string)
- `limit`: Number of orders per page (default: 50, max: 100)
- `page`: Page number (default: 1)
- `sortBy`: Sort field (createdAt, updatedAt, totalAmount, status, customerNumber)
- `sortOrder`: Sort direction (asc, desc)

#### Example Request

```
GET /orders?status=pending&limit=10&page=1&sortBy=createdAt&sortOrder=desc
```

#### Response (200 OK)

```json
{
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "customerNumber": "CUST001",
      "tableNumber": "T5",
      "staffId": "507f1f77bcf86cd799439011",
      "items": [...],
      "totalAmount": 25.00,
      "status": "pending",
      "paymentStatus": "unpaid",
      "notes": [...],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "filters": {
    "status": "pending",
    "limit": "10",
    "page": "1",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

### 3. Get Order by ID

**GET** `/orders/:id`

Retrieves a specific order by its ID.

#### Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalAmount": 25.00,
  "status": "pending",
  "paymentStatus": "unpaid",
  "notes": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses

- `400 Bad Request`: Invalid order ID format
- `404 Not Found`: Order not found

### 4. Update Order

**PUT** `/orders/:id`

Updates an existing order with status transition validation.

#### Request Body

```json
{
  "status": "in_progress",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "notes": [
    {
      "text": "Order started",
      "author": "Jane Smith",
      "category": "general"
    }
  ]
}
```

#### Status Transition Rules

- `pending` → `in_progress` or `cancelled`
- `in_progress` → `completed` or `cancelled`
- `completed` → No further transitions
- `cancelled` → No further transitions

#### Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalAmount": 25.00,
  "status": "in_progress",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "notes": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 5. Delete Order

**DELETE** `/orders/:id`

Deletes an order. Cannot delete completed orders.

#### Response (200 OK)

```json
{
  "message": "Order deleted successfully"
}
```

#### Error Responses

- `400 Bad Request`: Cannot delete completed orders
- `404 Not Found`: Order not found

### 6. Process Payment

**PUT** `/orders/:id/payment`

Processes payment for an order.

#### Request Body

```json
{
  "isPaid": true,
  "paymentMethod": "card",
  "amount": 25.0
}
```

#### Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalAmount": 25.00,
  "status": "pending",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "notes": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z"
}
```

### 7. Add Note to Order

**POST** `/orders/:id/notes`

Adds a note to an existing order.

#### Request Body

```json
{
  "text": "Customer requested extra napkins",
  "author": "John Doe",
  "category": "special_request"
}
```

#### Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "tableNumber": "T5",
  "staffId": "507f1f77bcf86cd799439011",
  "items": [...],
  "totalAmount": 25.00,
  "status": "pending",
  "paymentStatus": "unpaid",
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "text": "Customer requested extra napkins",
      "author": "John Doe",
      "timestamp": "2024-01-15T12:00:00.000Z",
      "category": "special_request"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 8. Get Order Statistics

**GET** `/orders/stats`

Retrieves aggregated order statistics.

#### Query Parameters

- `startDate`: Start date for statistics (ISO string)
- `endDate`: End date for statistics (ISO string)

#### Response (200 OK)

```json
{
  "totalOrders": 150,
  "totalRevenue": 3750.5,
  "averageOrderValue": 25.0,
  "pendingOrders": 15,
  "inProgressOrders": 8,
  "completedOrders": 120,
  "paidOrders": 125
}
```

## WebSocket Events

### Connection

Connect to WebSocket server at `ws://localhost:4000`

### Join Orders Room

```javascript
socket.emit('join:orders');
```

### Events Received

#### `order:created`

Emitted when a new order is created.

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "status": "pending",
  "totalAmount": 25.0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### `order:updated`

Emitted when an order is updated.

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerNumber": "CUST001",
  "status": "in_progress",
  "paymentStatus": "paid",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

#### `order:deleted`

Emitted when an order is deleted.

```json
{
  "id": "507f1f77bcf86cd799439013"
}
```

## Data Types

### Order Status

- `pending`: Order created, waiting to be processed
- `in_progress`: Order is being prepared
- `completed`: Order has been completed
- `cancelled`: Order has been cancelled

### Payment Status

- `unpaid`: Order has not been paid
- `partially_paid`: Order has been partially paid
- `paid`: Order has been fully paid

### Payment Method

- `cash`: Cash payment
- `card`: Card payment
- `split`: Split payment

### Note Category

- `allergy`: Allergy information
- `special_request`: Special customer requests
- `general`: General notes

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Limits are applied per IP address.

## Testing

Use the seeding script to populate test data:

```bash
cd backend
yarn seed:all
```

This will create sample drinks, staff, and orders for testing.
