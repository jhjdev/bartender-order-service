# Order System Documentation

## Overview

This document outlines the specifications for the order management system in the Bar Manager Dashboard. The system is designed to handle all aspects of order processing, from creation to payment, with comprehensive tracking and reporting capabilities.

## 1. Order Structure

### Basic Information

- Order ID (auto-generated)
- Date and Time
- Table Number/ID
- Staff Member (who took the order)
- Order Status (Pending, In Progress, Completed, Cancelled)
- Payment Status (Unpaid, Paid, Partially Paid)
- Payment Method (Cash, Card, Mobile Payment)
- Total Amount
- Tax Amount
- Tips (optional)

### Order Items

- Item ID
- Item Name
- Category (Beer, Wine, Cocktail, etc.)
- Quantity
- Unit Price
- Subtotal
- Special Instructions (optional)
- Modifiers (e.g., extra ice, no garnish)

### Additional Fields

- Customer Notes
- Time of Order
- Time of Completion
- Time of Payment
- Split Payment Information (if applicable)
- Discount Applied (if any)
- Loyalty Points Earned (if implemented)

## 2. Order Creation Form

### Quick Selection

- Category tabs (Beer, Wine, Cocktails, etc.)
- Popular items section
- Search bar for items

### Order Details

- Table selection dropdown
- Staff member dropdown
- Date and time picker
- Customer notes field

### Order Items

- Dynamic list of selected items
- Quantity controls
- Price calculations
- Ability to remove items
- Special instructions per item

### Payment Section

- Total amount display
- Tax calculation
- Tips input
- Payment method selection
- Split payment options
- Discount application

## 3. Order History/Overview

### Main View

- Today's orders at the top
- Search and filter options
- Sort options (by time, amount, status)

### Filter Options

- Date range
- Table number
- Staff member
- Order status
- Payment status
- Amount range
- Category of items

### Order Details View

- Complete order information
- Itemized list
- Payment details
- Timeline of order status changes
- Staff notes
- Customer feedback (if implemented)

## 4. Additional Features

### Real-time Updates

- Order status changes
- New orders notification
- Payment status updates

### Reporting

- Daily sales summary
- Popular items
- Staff performance
- Table turnover
- Peak hours analysis

### Customer Features

- Table reservations
- Customer profiles
- Loyalty program
- Feedback system

### Staff Features

- Order assignment
- Status updates
- Performance tracking
- Tips tracking

### Inventory Integration

- Automatic stock updates
- Low stock alerts
- Popular item tracking

### Analytics

- Sales trends
- Popular items
- Peak hours
- Staff performance
- Table utilization

## 5. Notifications and Staff Communication

### Order Status Notifications

- Real-time push notifications to mobile app for:
  - Order status changes
  - Payment status updates
  - New orders assigned
  - Order modifications
  - Customer requests
  - Table status changes

### Staff Communication Features

- Direct staff member notification system:
  - Ability to "ping" staff members from order overview
  - Custom notification messages for specific orders
  - Priority levels for notifications (urgent, normal, low)
  - Staff acknowledgment system
  - Notification history per order
  - Staff response tracking

### Mobile App Integration

- Push notification system for:
  - Order updates
  - Staff pings
  - Table status changes
  - Payment status updates
  - Customer requests
  - Inventory alerts
  - Schedule changes

### Notification Management

- Staff notification preferences
- Do Not Disturb settings
- Notification grouping
- Read/unread status
- Notification history
- Custom notification sounds
- Vibration patterns

## Implementation Notes

### Priority Order

1. Basic order creation and management
2. Order history and filtering
3. Payment processing
4. Reporting and analytics
5. Additional features (loyalty, reservations, etc.)

### Technical Considerations

- Real-time updates using WebSocket
- Efficient database queries for order history
- Proper error handling and validation
- Mobile-responsive design
- Performance optimization for large datasets

### Future Enhancements

- Mobile app integration
- Customer-facing order tracking
- Advanced analytics dashboard
- Integration with external POS systems
- Automated inventory management

## MongoDB Implementation

### Collections Structure

#### Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: String,          // Auto-incrementing or custom format
  date: Date,
  tableId: ObjectId,            // Reference to tables collection
  staffId: ObjectId,            // Reference to staff collection
  status: String,               // Enum: ['pending', 'in_progress', 'completed', 'cancelled']
  paymentStatus: String,        // Enum: ['unpaid', 'partially_paid', 'paid']
  paymentMethod: String,        // Enum: ['cash', 'card', 'mobile']
  items: [{
    itemId: ObjectId,           // Reference to menu items collection
    name: String,
    category: String,
    quantity: Number,
    unitPrice: Number,
    subtotal: Number,
    specialInstructions: String,
    modifiers: [String]
  }],
  totalAmount: Number,
  taxAmount: Number,
  tips: Number,
  customerNotes: String,
  timestamps: {
    created: Date,
    updated: Date,
    completed: Date,
    paid: Date
  },
  notifications: [{
    type: String,
    message: String,
    priority: String,
    timestamp: Date,
    staffId: ObjectId,          // Who sent the notification
    acknowledged: Boolean,
    acknowledgedAt: Date
  }]
}
```

#### Notifications Collection

```javascript
{
  _id: ObjectId,
  orderId: ObjectId,            // Reference to orders collection
  staffId: ObjectId,            // Target staff member
  type: String,                 // Enum: ['order_update', 'staff_ping', 'payment_update', etc.]
  message: String,
  priority: String,             // Enum: ['urgent', 'normal', 'low']
  status: String,               // Enum: ['sent', 'delivered', 'read', 'acknowledged']
  timestamps: {
    created: Date,
    delivered: Date,
    read: Date,
    acknowledged: Date
  },
  metadata: {
    // Additional context-specific data
  }
}
```

### Indexes

```javascript
// Orders Collection
db.orders.createIndex({ date: -1 });
db.orders.createIndex({ staffId: 1 });
db.orders.createIndex({ tableId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ paymentStatus: 1 });

// Notifications Collection
db.notifications.createIndex({ staffId: 1, status: 1 });
db.notifications.createIndex({ orderId: 1 });
db.notifications.createIndex({ created: -1 });
```

### Real-time Updates

- Use MongoDB Change Streams to watch for changes in orders and notifications
- Implement WebSocket connection for real-time updates to web and mobile clients
- Use MongoDB transactions for operations that need atomicity (e.g., order status updates with notifications)

### Performance Considerations

- Implement proper indexing for frequently queried fields
- Use aggregation pipeline for complex queries and reports
- Implement caching for frequently accessed data
- Use MongoDB's TTL index for automatic cleanup of old notifications
- Implement pagination for order history and notifications

### Data Consistency

- Use MongoDB transactions for operations that modify multiple documents
- Implement proper validation rules using MongoDB schema validation
- Use atomic operations for status updates
- Implement proper error handling and rollback mechanisms

### Scaling Considerations

- Use MongoDB sharding for horizontal scaling if needed
- Implement proper connection pooling
- Use MongoDB's read preferences for read scaling
- Implement proper backup and recovery strategies
