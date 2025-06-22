# Development Roadmap

This document outlines a comprehensive, realistic week-by-week plan for the development of the Bar Manager Dashboard. The plan assumes one developer (with AI assistance) working on the project.

## Week 1: Real-time Order Updates & Notes System

### Day 1-2: WebSocket Setup & Order Notes

- [x] Set up WebSocket server using Socket.IO for real-time updates
- [x] Add `notes` field to Order model in MongoDB
- [x] Implement order notes functionality (add, edit, delete notes)
- [x] Create WebSocket events for order status changes and new orders

### Day 3-4: Real-time Frontend Integration

- [x] Install Socket.IO client in frontend
- [x] Implement real-time order updates in the web app
- [x] Add live order status indicators
- [x] Create notification system for new orders and status changes

### Day 5: Testing Real-time Features

- [x] Test WebSocket connections and real-time updates
- [x] Verify order notes functionality
- [x] Test order status changes across multiple browser tabs
- [x] Debug any real-time synchronization issues

### Day 6: Payment Processing & Final Testing

- [x] Add payment processing endpoint (`PUT /:id/payment`)
- [x] Implement payment status updates with WebSocket events
- [x] Test payment flow end-to-end
- [x] Verify all CRUD operations work correctly
- [x] Test real-time updates across multiple clients
- [x] Final validation of order system functionality

## Week 1 Status: ✅ COMPLETE

**All Week 1 tasks have been successfully completed!** The order system now includes:

✅ **Complete WebSocket Integration** - Real-time updates for all order operations  
✅ **Order Notes System** - Add, edit, delete notes with categories and timestamps  
✅ **Payment Processing** - Full payment status management with real-time updates  
✅ **Comprehensive CRUD Operations** - Create, read, update, delete orders  
✅ **Real-time Notifications** - Live updates across all connected clients  
✅ **Proper Timestamps** - createdAt, updatedAt, completedAt, and note timestamps  
✅ **Error Handling** - Robust validation and error responses  
✅ **Pagination & Filtering** - Efficient order listing with search capabilities

**Ready to proceed to Week 2!** 🚀

## Real-time Architecture Overview

### **WebSocket Implementation:**

- **Server**: Socket.IO with Express.js backend
- **Client**: Socket.IO client in React frontend
- **Events**:
  - `order:created` - New order notification
  - `order:updated` - Order status/notes changes
  - `order:completed` - Order completion notification

### **Order Notes System:**

- **Database**: MongoDB with notes array in Order model
- **Features**:
  - Add notes to orders (allergies, special requests, etc.)
  - Edit/delete notes
  - Real-time note updates across all clients
  - Note history and timestamps

### **Benefits of This Approach:**

- ✅ **Free** - No external service costs
- ✅ **Simple** - Direct database integration
- ✅ **Reliable** - Works offline, reconnects automatically
- ✅ **Perfect for bars** - Order-focused, not complex messaging

## Week 2: Order System Backend

### Day 1-2: Order Routes & Controllers

- [x] Implement CRUD endpoints for orders (create, read, update, delete).
- [x] Add validation for order data (e.g., required fields, valid statuses, payment methods).
- [x] Implement error handling and proper HTTP status codes.
- [x] Add WebSocket event emissions for real-time updates.

### Day 3-4: Order Model & Database Schema

- [x] Finalize the MongoDB schema for orders with notes field.
- [x] Ensure indexes are set up for efficient querying (e.g., by date, status, staff, table).
- [x] Test the model with sample data including notes.

### Day 5: Order Status & Payment Logic

- [x] Implement logic for order status transitions (e.g., pending → in_progress → completed).
- [x] Add payment status handling (unpaid, partially paid, paid).
- [x] Implement split payment logic if needed.
- [x] Emit WebSocket events for status changes.

### Day 6: Real-time Updates & Advanced Features

- [x] Implement real-time updates for order status and notifications using WebSocket.
- [x] Test the model and endpoints with sample data.
- [x] Verify WebSocket events are properly emitted and received.
- [x] Add advanced filtering and search capabilities.
- [x] Implement order statistics endpoint.
- [x] Create comprehensive seeding script for test data.

## Week 2 Status: ✅ COMPLETE

**All Week 2 tasks have been successfully completed!** The backend now includes:

✅ **Enhanced Validation** - Comprehensive input validation with detailed error messages  
✅ **Status Transition Logic** - Proper order status flow validation  
✅ **Advanced Filtering** - Multi-criteria search and filtering capabilities  
✅ **Database Indexes** - Optimized queries for performance  
✅ **Order Statistics** - Aggregation endpoints for analytics  
✅ **Seeding Scripts** - Complete test data generation  
✅ **Error Handling** - Robust error responses and logging  
✅ **Payment Processing** - Full payment status management  
✅ **Real-time Events** - WebSocket integration for all operations

**Ready to proceed to Week 3!** 🚀

## Week 3: Order System Frontend

### Day 1-2: Order Creation Form

- Build the UI for creating new orders (table selection, staff selection, item selection, notes, etc.).
- Implement dynamic item lists, quantity controls, and price calculations.
- Add validation and error handling.
- Include notes field in order creation form.

### Day 3-4: Order History/Overview

- Build the UI for viewing order history (filtering, sorting, detailed views).
- Implement real-time updates for order status changes via WebSocket.
- Add pagination or infinite scroll for large datasets.
- Display order notes in the overview.

### Day 5: Order Details View

- Build a detailed view for individual orders (timeline, payment details, notes, etc.).
- Allow staff to update order status or add/edit notes.
- Implement real-time note updates across all connected clients.
- Add note history and timestamps.

### Day 6: Test Order Flow

- Test the order flow end-to-end with real-time updates.
- Verify WebSocket connections and event handling.
- Test order notes functionality across multiple users.

## Week 4: Seed Orders & Prepare for Reports

### Day 1-2: Seed Orders

- Use your seeding script to populate the database with sample orders.
- Ensure the data is realistic and covers various scenarios (e.g., different statuses, payment methods, split payments, notes).
- Test real-time updates with seeded data.

### Day 3-5: Prepare for Reports

- Once orders are seeded, start building the reporting tool.
- Focus on basic reports first (e.g., daily sales, popular items, staff performance).
- Use D3.js for data visualization.
- Include notes analytics in reports.

## Week 5: Schedule Management (Advanced)

### Day 1-2: Drag-and-Drop Shift Assignment

- Implement drag-and-drop shift assignment and shift templates.
- Add time-off requests and staff availability management.
- Implement conflict detection and resolution for shifts.
- Add real-time updates and notifications for schedule changes (WebSocket).
- Build UI for schedule calendar (month/week/day/list views).
- Add staff management features (profiles, availability, performance metrics).
- Test schedule creation, editing, and conflict workflows.

## Week 6: Inventory Management (Advanced)

### Day 1-2: Map Out Inventory Architecture

- Map out the inventory architecture.
- Implement stock tracking, low stock alerts, and automatic updates.

### Day 3-4: Supplier Management

- Add supplier management (profiles, performance, order history).
- Implement purchase order management (create, edit, status tracking, delivery tracking).
- Add waste tracking and cost analysis.
- Implement real-time stock updates and low stock alerts (WebSocket).
- Build UI for inventory, suppliers, and purchase orders.
- Test inventory workflows and reporting.

## Week 7: Reports & Analytics (Advanced)

### Day 1-2: Expand Reporting Tool

- Expand reporting tool to include inventory, customer, and operational analytics.
- Add customizable dashboards with D3.js widgets (charts, tables, metrics).
- Implement export features (PDF, Excel, CSV).
- Add advanced filtering, drill-down, and data visualization options.
- Build UI for analytics dashboard and report builder.
- Test analytics workflows and export functionality.

## Week 8: Enhanced Order Notes & Communication

### Day 1-2: Advanced Order Notes System

- Implement rich text notes with formatting options.
- Add note categories (allergies, special requests, customer preferences, etc.).
- Build note templates for common scenarios.
- Add note search and filtering functionality.
- Implement note notifications and alerts.
- Build UI for advanced note management and templates.
- Test note workflows and real-time updates.

### Day 3-4: Order Communication Features

- Add customer communication features (message templates, order confirmations).
- Implement order status notifications for customers.
- Add feedback collection and rating system.
- Build notification system for staff (WebSocket-based).
- Add file attachments to orders (receipts, photos, etc.).
- Build UI for customer communication and feedback.
- Test communication workflows and notifications.

## Week 9: File Management

### Day 1-2: File Storage

- Implement file storage, folder structure, and file categorization.
- Add version control, sharing (links, permissions), and advanced search.
- Build UI for file browser, upload, preview, and sharing dialogs.
- Add integration with orders and notes.
- Test file operations, sharing, and search workflows.

## Week 10: Dashboard Enhancements

### Day 1-2: Customizable Dashboard Widgets

- Implement customizable dashboard widgets (metrics, charts, tables, status, quick actions).
- Add widget management (add, remove, configure, arrange, resize).
- Implement quick actions (create order, add staff, update inventory, add notes, generate report).
- Add real-time updates and notifications to dashboard widgets.
- Build UI for dashboard customization and quick actions.
- Test dashboard workflows and user preferences.

## Week 11+: Future Enhancements & Polish

### Day 1-2: Loyalty Program

- Once orders are flowing, start collecting customer data.
- Design the customer profile schema (e.g., name, contact, order history, loyalty points).

### Day 3-4: Loyalty Logic

- Implement loyalty point calculation (e.g., points per currency spent).
- Add redemption logic (e.g., minimum points for rewards).
- Build the UI for customers to view their points and rewards.

### Day 5: Testing

- Write unit tests for loyalty logic.
- Test the loyalty flow end-to-end.

### Day 6: Mobile App Integration

- Start mapping out the mobile app architecture.
- Expand the API to support mobile features.
- Add GitHub Actions for CI/CD.
- Add Swagger for API documentation.

### Day 7: Advanced Analytics

- Implement predictive analytics, AI-powered insights, custom metrics.
- Integration with external POS/accounting systems.
- Automated inventory management and reordering.
- Advanced file management: collaborative editing, document signing, OCR, AI-powered organization.
- Performance optimization, accessibility, and mobile responsiveness.

### Day 8: Continuous Testing, Documentation, and DevOps

- Continuous testing, documentation, and DevOps (CI/CD, GitHub Actions, Swagger API docs).

## Firebase Removal & WebSocket Implementation Plan

### **Phase 1: Firebase Removal**

#### **1. Remove Firebase Dependencies:**

```bash
# Remove Firebase packages
yarn remove firebase
yarn remove firebase-admin
yarn remove firebase-functions
yarn remove firebase-functions-test

# Remove Firebase config files
rm -rf functions/
rm firebase.json
rm firestore.rules
rm firestore.indexes.json
rm storage.rules
```

#### **2. Remove Firebase Files:**

- Delete `functions/` directory
- Delete `firebase.json`
- Delete `firestore.rules`
- Delete `firestore.indexes.json`
- Delete `storage.rules`
- Delete `public/firebase-messaging-sw.js`

#### **3. Clean Up Frontend:**

- Remove Firebase imports from components
- Remove Firebase config files (`src/config/firebase.ts`)
- Update notification components to use WebSocket
- Remove Firebase-related environment variables

#### **4. Update Package.json Scripts:**

```json
{
  "scripts": {
    // Remove Firebase-related scripts
    "firebase:emulators": "echo 'Firebase removed - using WebSocket instead'",
    "notifications:local": "echo 'Using local WebSocket notifications'"
  }
}
```

### **Phase 2: WebSocket Implementation**

#### **1. Add Socket.IO to Backend:**

```bash
cd backend
yarn add socket.io
yarn add @types/socket.io
```

#### **2. Update Order Model (MongoDB):**

Add `notes` field to your MongoDB Order schema:

```typescript
// backend/models/order.ts
interface OrderNote {
  text: string;
  author: string;
  timestamp: Date;
  category: 'allergy' | 'special_request' | 'general';
}

interface Order {
  // ... existing fields
  notes: OrderNote[];
}
```

#### **3. WebSocket Server Setup:**

```typescript
// backend/socket.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room for real-time updates
    socket.on('join:orders', () => {
      socket.join('orders');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
```

#### **4. Update Backend Index:**

```typescript
// backend/index.ts
import { createServer } from 'http';
import { setupSocket } from './socket';

const server = createServer(app);
const io = setupSocket(server);

// Make io available to controllers
app.set('io', io);

// Start server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

#### **5. Emit Events on Order Changes:**

```typescript
// In your order controller
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);

    // Emit WebSocket event
    const io = req.app.get('io');
    io.to('orders').emit('order:created', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Emit WebSocket event
    const io = req.app.get('io');
    io.to('orders').emit('order:updated', order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **6. Frontend Socket.IO Client:**

```bash
cd src
yarn add socket.io-client
```

#### **7. Create Socket Context:**

```typescript
// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join:orders');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
```

#### **8. Real-time Order Updates:**

```typescript
// In your React components
import { useSocket } from '../contexts/SocketContext';

const OrderList: React.FC = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('order:created', (newOrder: Order) => {
      setOrders((prev) => [...prev, newOrder]);
    });

    socket.on('order:updated', (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on('order:completed', (completedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === completedOrder._id ? completedOrder : order
        )
      );
    });

    return () => {
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('order:completed');
    };
  }, [socket]);

  // ... rest of component
};
```

#### **9. Order Notes Component:**

```typescript
// src/components/OrderNotes.tsx
import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface OrderNotesProps {
  orderId: string;
  notes: OrderNote[];
  onAddNote: (note: Omit<OrderNote, 'timestamp'>) => void;
}

const OrderNotes: React.FC<OrderNotesProps> = ({
  orderId,
  notes,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<
    'allergy' | 'special_request' | 'general'
  >('general');
  const { socket } = useSocket();

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      text: newNote,
      author: 'Current User', // Get from auth context
      category,
    };

    onAddNote(note);
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Notes</h3>

      {/* Add new note */}
      <div className="space-y-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="general">General</option>
          <option value="allergy">Allergy</option>
          <option value="special_request">Special Request</option>
        </select>

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full border rounded px-2 py-1"
        />

        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Display notes */}
      <div className="space-y-2">
        {notes.map((note, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">{note.author}</span>
              <span className="text-xs text-gray-500">
                {new Date(note.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="mt-1">{note.text}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 rounded">
              {note.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Phase 3: Testing & Validation**

#### **1. Test WebSocket Connection:**

- Verify Socket.IO server starts with backend
- Test client connection in browser
- Check real-time updates across multiple tabs

#### **2. Test Order Events:**

- Create new order → verify `order:created` event
- Update order → verify `order:updated` event
- Complete order → verify `order:completed` event

#### **3. Test Notes Functionality:**

- Add note to order → verify real-time update
- Edit note → verify update across clients
- Delete note → verify removal across clients

### **Benefits of This Implementation:**

✅ **Cost-effective** - No Firebase subscription needed  
✅ **Simple architecture** - Direct MongoDB integration  
✅ **Real-time updates** - WebSocket for instant synchronization  
✅ **Offline support** - Reconnects automatically  
✅ **Scalable** - Can handle multiple concurrent users  
✅ **Maintainable** - No external service dependencies

### **Migration Checklist:**

- [ ] Remove Firebase dependencies
- [ ] Delete Firebase configuration files
- [ ] Install Socket.IO packages
- [ ] Update Order model with notes field
- [ ] Implement WebSocket server
- [ ] Update order controllers with event emissions
- [ ] Create Socket.IO client context
- [ ] Update frontend components for real-time updates
- [ ] Test WebSocket connections and events
- [ ] Test order notes functionality
- [ ] Update documentation

## Notes

- This roadmap is flexible and can be adjusted based on progress and priorities.
- Each week's tasks are designed to be achievable by one developer with AI assistance.
- Testing should be done continuously throughout the development process.
- Documentation should be updated as new features are implemented.
- The real-time system uses WebSockets instead of Firebase for cost-effectiveness and simplicity.
