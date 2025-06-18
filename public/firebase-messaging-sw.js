/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: 'AIzaSyDN0w3TzzXRj2TipDiGBJR9IfcJqjt7PzM',
  authDomain: 'bar-manager-6b790.firebaseapp.com',
  projectId: 'bar-manager-6b790',
  storageBucket: 'bar-manager-6b790.firebasestorage.app',
  messagingSenderId: '167556735089',
  appId: '1:167556735089:web:081e4d45039998d5f8bbd0',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Make sure to add an icon to your public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
