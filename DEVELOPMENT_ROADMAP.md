# Development Roadmap

This document outlines a comprehensive, realistic week-by-week plan for the development of the Bar Manager Dashboard. The plan assumes one developer (with AI assistance) working on the project.

## Week 1: Firebase Cloud Messaging (FCM) Setup

### Day 1-2: Firebase Project Setup

- [x] Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
- [x] Enable Firebase Cloud Messaging (FCM).
- [x] Set up Firebase Authentication (if not already done).

### Day 3-4: FCM Integration in Web App

- [x] Install the Firebase JS SDK:
  ```bash
  npm install firebase
  # or
  yarn add firebase
  ```
- [x] Initialize Firebase in your app (e.g., in `src/config/firebase.ts`):

  ```typescript
  import { initializeApp } from 'firebase/app';
  import { getMessaging } from 'firebase/messaging';

  const firebaseConfig = {
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'your-storage-bucket',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id',
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  export { messaging };
  ```

- [x] Set up a service worker for web notifications (e.g., in `public/firebase-messaging-sw.js`):

  ```javascript
  importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
  );

  firebase.initializeApp({
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'your-storage-bucket',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id',
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/icon.png',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  ```

- [x] Request notification permissions in your app (e.g., in `src/App.tsx`):

  ```typescript
  import { getToken } from 'firebase/messaging';
  import { messaging } from './config/firebase';

  async function requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging);
        console.log('Notification token:', token);
        // Send the token to your server
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  // Call this function when your app starts
  requestNotificationPermission();
  ```

### Day 5: Testing FCM Notifications

- [x] Use the Firebase Console to send a test notification to your web app.
- [x] Verify that the notification appears in the browser.
- [x] Debug any issues with FCM setup.

## Firebase Blaze Plan & Hosting Considerations

- **Firebase Blaze Plan Upgrade:**

  - To deploy Cloud Functions, you must upgrade your Firebase project to the Blaze (pay-as-you-go) plan.
  - Visit the [Firebase Console](https://console.firebase.google.com/project/bar-manager-6b790/usage/details) to upgrade.
  - Once upgraded, you can deploy your functions using `yarn deploy` inside the functions folder.

- **Hosting Options:**
  - If you prefer not to use Firebase Hosting, consider alternatives like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [Cloudflare Pages](https://pages.cloudflare.com/).
  - These platforms offer free tiers and are easy to set up for hobby projects.

## Week 2: Order System Backend

### Day 1-2: Order Routes & Controllers

- Implement CRUD endpoints for orders (create, read, update, delete).
- Add validation for order data (e.g., required fields, valid statuses, payment methods).
- Implement error handling and proper HTTP status codes.

### Day 3-4: Order Model & Database Schema

- Finalize the MongoDB schema for orders (as outlined in ORDER_SYSTEM.md).
- Ensure indexes are set up for efficient querying (e.g., by date, status, staff, table).
- Test the model with sample data.

### Day 5: Order Status & Payment Logic

- Implement logic for order status transitions (e.g., pending → in_progress → completed).
- Add payment status handling (unpaid, partially paid, paid).
- Implement split payment logic if needed.

### Day 6: Real-time Updates

- Implement real-time updates for order status and notifications using WebSocket.
- Test the model and endpoints with sample data.

## Week 3: Order System Frontend

### Day 1-2: Order Creation Form

- Build the UI for creating new orders (table selection, staff selection, item selection, notes, etc.).
- Implement dynamic item lists, quantity controls, and price calculations.
- Add validation and error handling.

### Day 3-4: Order History/Overview

- Build the UI for viewing order history (filtering, sorting, detailed views).
- Implement real-time updates for order status changes.
- Add pagination or infinite scroll for large datasets.

### Day 5: Order Details View

- Build a detailed view for individual orders (timeline, payment details, notes, etc.).
- Allow staff to update order status or add notes.

### Day 6: Test Order Flow

- Test the order flow end-to-end.

## Week 4: Seed Orders & Prepare for Reports

### Day 1-2: Seed Orders

- Use your seeding script to populate the database with sample orders.
- Ensure the data is realistic and covers various scenarios (e.g., different statuses, payment methods, split payments).

### Day 3-5: Prepare for Reports

- Once orders are seeded, start building the reporting tool.
- Focus on basic reports first (e.g., daily sales, popular items, staff performance).
- Use D3.js for data visualization.

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

## Week 8: Messaging, Communication & CRM Tools

### Day 1-2: Internal Messaging System

- Implement internal messaging system (direct, group, announcements).
- Add customer communication features (message templates, history, feedback).
- Build notification system for staff and customers (WebSocket, FCM).
- Add file sharing and attachment support in messages.
- Implement read receipts, message categories, and search.
- Build UI for message center, announcements, and customer communication.
- Test messaging and notification workflows.

## Week 9: File Management

### Day 1-2: File Storage

- Implement file storage, folder structure, and file categorization.
- Add version control, sharing (links, permissions), and advanced search.
- Build UI for file browser, upload, preview, and sharing dialogs.
- Add integration with messaging and CRM tools.
- Test file operations, sharing, and search workflows.

## Week 10: Dashboard Enhancements

### Day 1-2: Customizable Dashboard Widgets

- Implement customizable dashboard widgets (metrics, charts, tables, status, quick actions).
- Add widget management (add, remove, configure, arrange, resize).
- Implement quick actions (create order, add staff, update inventory, send message, generate report).
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

## Notes

- This roadmap is flexible and can be adjusted based on progress and priorities.
- Each week's tasks are designed to be achievable by one developer with AI assistance.
- Testing should be done continuously throughout the development process.
- Documentation should be updated as new features are implemented.
