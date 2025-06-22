# Mobile App WebSocket Integration Guide

This document outlines how to integrate the WebSocket server with mobile applications (iOS/Android) for real-time order updates and notifications.

## Overview

The WebSocket server runs on `http://localhost:4000` and provides real-time communication for:

- Order creation, updates, and deletion
- Order status changes
- Order notes and comments
- Real-time notifications

## WebSocket Events

### Client to Server Events

#### Join Rooms

```javascript
// Join orders room to receive order updates
socket.emit('join:orders');

// Join notifications room to receive notifications
socket.emit('join:notifications');
```

### Server to Client Events

#### Order Events

```javascript
// New order created
socket.on('order:created', (order) => {
  console.log('New order:', order);
  // Update UI with new order
});

// Order updated (status, payment, notes, etc.)
socket.on('order:updated', (order) => {
  console.log('Order updated:', order);
  // Update order in UI
});

// Order deleted
socket.on('order:deleted', ({ id }) => {
  console.log('Order deleted:', id);
  // Remove order from UI
});
```

## Mobile App Implementation

### React Native with Socket.IO Client

#### 1. Install Dependencies

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

#### 2. Create Socket Context

```javascript
// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      newSocket.emit('join:orders');
      newSocket.emit('join:notifications');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
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

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
```

#### 3. Use in Components

```javascript
// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const OrderList = () => {
  const { socket, isConnected } = useSocket();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for order events
    socket.on('order:created', (newOrder) => {
      setOrders((prev) => [...prev, newOrder]);
    });

    socket.on('order:updated', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on('order:deleted', ({ id }) => {
      setOrders((prev) => prev.filter((order) => order._id !== id));
    });

    return () => {
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('order:deleted');
    };
  }, [socket]);

  return (
    <View>
      <Text>
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </View>
  );
};
```

### Flutter with Socket.IO

#### 1. Add Dependencies

```yaml
# pubspec.yaml
dependencies:
  socket_io_client: ^2.0.3+1
```

#### 2. Create Socket Service

```dart
// lib/services/socket_service.dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static SocketService? _instance;
  IO.Socket? _socket;
  bool _isConnected = false;

  SocketService._();

  static SocketService get instance {
    _instance ??= SocketService._();
    return _instance!;
  }

  void connect() {
    _socket = IO.io('http://localhost:4000', <String, dynamic>{
      'transports': ['websocket', 'polling'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) {
      print('Connected to WebSocket server');
      _isConnected = true;
      _socket!.emit('join:orders');
      _socket!.emit('join:notifications');
    });

    _socket!.onDisconnect((_) {
      print('Disconnected from WebSocket server');
      _isConnected = false;
    });

    _socket!.onConnectError((error) {
      print('WebSocket connection error: $error');
      _isConnected = false;
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
  }

  bool get isConnected => _isConnected;
  IO.Socket? get socket => _socket;
}
```

#### 3. Use in Widgets

```dart
// lib/widgets/order_list.dart
import 'package:flutter/material.dart';
import '../services/socket_service.dart';

class OrderList extends StatefulWidget {
  @override
  _OrderListState createState() => _OrderListState();
}

class _OrderListState extends State<OrderList> {
  final List<Map<String, dynamic>> _orders = [];
  final SocketService _socketService = SocketService.instance;

  @override
  void initState() {
    super.initState();
    _setupSocketListeners();
  }

  void _setupSocketListeners() {
    _socketService.socket?.on('order:created', (data) {
      setState(() {
        _orders.add(data);
      });
    });

    _socketService.socket?.on('order:updated', (data) {
      setState(() {
        final index = _orders.indexWhere((order) => order['_id'] == data['_id']);
        if (index != -1) {
          _orders[index] = data;
        }
      });
    });

    _socketService.socket?.on('order:deleted', (data) {
      setState(() {
        _orders.removeWhere((order) => order['_id'] == data['id']);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Connection: ${_socketService.isConnected ? "Connected" : "Disconnected"}'),
        Expanded(
          child: ListView.builder(
            itemCount: _orders.length,
            itemBuilder: (context, index) {
              final order = _orders[index];
              return OrderCard(order: order);
            },
          ),
        ),
      ],
    );
  }
}
```

### Native iOS (Swift)

#### 1. Install Socket.IO Client

```swift
// Add to Podfile
pod 'Socket.IO-Client-Swift'
```

#### 2. Create Socket Manager

```swift
// SocketManager.swift
import Foundation
import SocketIO

class SocketManager: ObservableObject {
    static let shared = SocketManager()
    private var manager: SocketManager?
    private var socket: SocketIOClient?

    @Published var isConnected = false

    private init() {}

    func connect() {
        guard let url = URL(string: "http://localhost:4000") else { return }

        manager = SocketManager(socketURL: url, config: [
            .log(true),
            .compress,
            .connectParams(["EIO": "4"])
        ])

        socket = manager?.defaultSocket

        socket?.on(clientEvent: .connect) { [weak self] data, ack in
            print("Connected to WebSocket server")
            self?.isConnected = true
            self?.socket?.emit("join:orders")
            self?.socket?.emit("join:notifications")
        }

        socket?.on(clientEvent: .disconnect) { [weak self] data, ack in
            print("Disconnected from WebSocket server")
            self?.isConnected = false
        }

        socket?.connect()
    }

    func disconnect() {
        socket?.disconnect()
    }

    func onOrderCreated(completion: @escaping ([String: Any]) -> Void) {
        socket?.on("order:created") { data, ack in
            if let orderData = data.first as? [String: Any] {
                completion(orderData)
            }
        }
    }

    func onOrderUpdated(completion: @escaping ([String: Any]) -> Void) {
        socket?.on("order:updated") { data, ack in
            if let orderData = data.first as? [String: Any] {
                completion(orderData)
            }
        }
    }

    func onOrderDeleted(completion: @escaping (String) -> Void) {
        socket?.on("order:deleted") { data, ack in
            if let orderData = data.first as? [String: Any],
               let id = orderData["id"] as? String {
                completion(id)
            }
        }
    }
}
```

#### 3. Use in SwiftUI

```swift
// OrderListView.swift
import SwiftUI

struct OrderListView: View {
    @StateObject private var socketManager = SocketManager.shared
    @State private var orders: [[String: Any]] = []

    var body: some View {
        VStack {
            Text("Connection: \(socketManager.isConnected ? "Connected" : "Disconnected")")

            List(orders, id: \.self) { order in
                OrderCardView(order: order)
            }
        }
        .onAppear {
            socketManager.connect()
            setupSocketListeners()
        }
        .onDisappear {
            socketManager.disconnect()
        }
    }

    private func setupSocketListeners() {
        socketManager.onOrderCreated { order in
            DispatchQueue.main.async {
                orders.append(order)
            }
        }

        socketManager.onOrderUpdated { updatedOrder in
            DispatchQueue.main.async {
                if let id = updatedOrder["_id"] as? String,
                   let index = orders.firstIndex(where: { ($0["_id"] as? String) == id }) {
                    orders[index] = updatedOrder
                }
            }
        }

        socketManager.onOrderDeleted { id in
            DispatchQueue.main.async {
                orders.removeAll { ($0["_id"] as? String) == id }
            }
        }
    }
}
```

### Native Android (Kotlin)

#### 1. Add Dependencies

```gradle
// build.gradle
dependencies {
    implementation 'io.socket:socket.io-client:2.1.0'
}
```

#### 2. Create Socket Manager

```kotlin
// SocketManager.kt
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class SocketManager private constructor() {
    companion object {
        @Volatile
        private var INSTANCE: SocketManager? = null

        fun getInstance(): SocketManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: SocketManager().also { INSTANCE = it }
            }
        }
    }

    private var socket: Socket? = null
    private val _isConnected = MutableStateFlow(false)
    val isConnected: StateFlow<Boolean> = _isConnected

    fun connect() {
        try {
            val options = IO.Options().apply {
                transports = arrayOf("websocket", "polling")
            }

            socket = IO.socket("http://localhost:4000", options)

            socket?.on(Socket.EVENT_CONNECT) {
                println("Connected to WebSocket server")
                _isConnected.value = true
                socket?.emit("join:orders")
                socket?.emit("join:notifications")
            }

            socket?.on(Socket.EVENT_DISCONNECT) {
                println("Disconnected from WebSocket server")
                _isConnected.value = false
            }

            socket?.connect()
        } catch (e: Exception) {
            println("Socket connection error: ${e.message}")
        }
    }

    fun disconnect() {
        socket?.disconnect()
    }

    fun onOrderCreated(callback: (Map<String, Any>) -> Unit) {
        socket?.on("order:created") { args ->
            val orderData = args.firstOrNull() as? Map<String, Any>
            orderData?.let { callback(it) }
        }
    }

    fun onOrderUpdated(callback: (Map<String, Any>) -> Unit) {
        socket?.on("order:updated") { args ->
            val orderData = args.firstOrNull() as? Map<String, Any>
            orderData?.let { callback(it) }
        }
    }

    fun onOrderDeleted(callback: (String) -> Unit) {
        socket?.on("order:deleted") { args ->
            val data = args.firstOrNull() as? Map<String, Any>
            val id = data?.get("id") as? String
            id?.let { callback(it) }
        }
    }
}
```

#### 3. Use in Activity/Fragment

```kotlin
// OrderListActivity.kt
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class OrderListActivity : AppCompatActivity() {
    private val socketManager = SocketManager.getInstance()
    private val orders = mutableListOf<Map<String, Any>>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_list)

        setupSocketListeners()
        socketManager.connect()

        // Observe connection status
        lifecycleScope.launch {
            socketManager.isConnected.collect { isConnected ->
                updateConnectionStatus(isConnected)
            }
        }
    }

    private fun setupSocketListeners() {
        socketManager.onOrderCreated { order ->
            runOnUiThread {
                orders.add(order)
                updateOrderList()
            }
        }

        socketManager.onOrderUpdated { updatedOrder ->
            runOnUiThread {
                val id = updatedOrder["_id"] as? String
                val index = orders.indexOfFirst { it["_id"] == id }
                if (index != -1) {
                    orders[index] = updatedOrder
                    updateOrderList()
                }
            }
        }

        socketManager.onOrderDeleted { id ->
            runOnUiThread {
                orders.removeAll { it["_id"] == id }
                updateOrderList()
            }
        }
    }

    private fun updateConnectionStatus(isConnected: Boolean) {
        // Update UI to show connection status
    }

    private fun updateOrderList() {
        // Update RecyclerView or ListView
    }

    override fun onDestroy() {
        super.onDestroy()
        socketManager.disconnect()
    }
}
```

## API Endpoints for Mobile

### REST API Base URL

```
http://localhost:4000/api
```

### Authentication

All endpoints require authentication via JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Order Endpoints

#### Get All Orders

```
GET /api/orders
Query Parameters:
- status: Filter by status (pending, in_progress, completed, cancelled)
- limit: Number of orders per page (default: 50)
- page: Page number (default: 1)
```

#### Get Order by ID

```
GET /api/orders/:id
```

#### Create Order

```
POST /api/orders
Body:
{
  "customerNumber": "string",
  "tableNumber": "string (optional)",
  "staffId": "string (optional)",
  "items": [
    {
      "drinkId": "string",
      "quantity": number,
      "notes": "string (optional)"
    }
  ],
  "notes": [
    {
      "text": "string",
      "author": "string",
      "category": "general|allergy|special_request"
    }
  ]
}
```

#### Update Order

```
PUT /api/orders/:id
Body:
{
  "status": "pending|in_progress|completed|cancelled",
  "paymentStatus": "unpaid|partially_paid|paid",
  "paymentMethod": "cash|card|split",
  "notes": [...]
}
```

#### Delete Order

```
DELETE /api/orders/:id
```

#### Add Note to Order

```
POST /api/orders/:id/notes
Body:
{
  "text": "string",
  "author": "string",
  "category": "general|allergy|special_request"
}
```

## Testing WebSocket Connection

### WebSocket Test Client

```javascript
// Test in browser console
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('join:orders');
});

socket.on('order:created', (order) => {
  console.log('New order:', order);
});

socket.on('order:updated', (order) => {
  console.log('Order updated:', order);
});

socket.on('order:deleted', (data) => {
  console.log('Order deleted:', data);
});
```

### Test Order Creation

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "customerNumber": "C001",
    "tableNumber": "T1",
    "items": [
      {
        "drinkId": "drink_id_here",
        "quantity": 2
      }
    ],
    "notes": [
      {
        "text": "Customer prefers extra ice",
        "author": "Server",
        "category": "special_request"
      }
    ]
  }'
```

## Error Handling

### Connection Errors

- Implement exponential backoff for reconnection
- Show user-friendly error messages
- Provide offline mode when possible

### Event Handling

- Always validate data before processing
- Handle missing or malformed data gracefully
- Log errors for debugging

### Security Considerations

- Use HTTPS/WSS in production
- Implement proper authentication
- Validate all incoming data
- Rate limit connections if needed

## Production Deployment

### Environment Variables

```bash
# Backend
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bartender
JWT_SECRET=your_jwt_secret

# Frontend/Mobile
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com
```

### SSL/TLS Configuration

- Use WSS (WebSocket Secure) in production
- Configure proper SSL certificates
- Set up reverse proxy (nginx) if needed

### Scaling Considerations

- Use Redis adapter for Socket.IO clustering
- Implement load balancing
- Monitor connection limits and performance
