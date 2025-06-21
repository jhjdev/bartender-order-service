// Notification service configuration
export const NOTIFICATION_CONFIG = {
  // Set to true when you upgrade to Firebase Blaze plan and deploy functions
  USE_FIREBASE_FUNCTIONS: false,

  // Local development endpoints
  LOCAL_ENDPOINTS: {
    SEND_TEST: '/api/notifications/send-test',
    HEALTH: '/api/notifications/health',
  },

  // Firebase function names (for when you upgrade)
  FIREBASE_FUNCTIONS: {
    SEND_TEST: 'sendTestNotification',
  },
};

// Helper function to get the correct endpoint based on configuration
export const getNotificationEndpoint = (type: 'send-test' | 'health') => {
  if (NOTIFICATION_CONFIG.USE_FIREBASE_FUNCTIONS) {
    // This will be used when you upgrade to Firebase Blaze
    return NOTIFICATION_CONFIG.FIREBASE_FUNCTIONS.SEND_TEST;
  } else {
    // Local development mode
    return NOTIFICATION_CONFIG.LOCAL_ENDPOINTS[
      type.toUpperCase() as keyof typeof NOTIFICATION_CONFIG.LOCAL_ENDPOINTS
    ];
  }
};
