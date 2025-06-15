export interface TaxSettings {
  country: string;
  beerTaxRate: number;
  wineTaxRate: number;
  spiritsTaxRate: number;
  isBeerTaxEnabled: boolean;
  isWineTaxEnabled: boolean;
  isSpiritsTaxEnabled: boolean;
}

export interface LoyaltySettings {
  isEnabled: boolean;
  pointsPerCurrency: number;
  minimumPointsForRedemption: number;
  pointsExpirationDays: number;
}

export interface OrderSettings {
  defaultPaymentMethods: string[];
  defaultOrderStatuses: string[];
  maxTables: number;
  tableNamingConvention: string;
  businessName: string;
  businessAddress: string;
  vatNumber: string;
  currency: string;
  timezone: string;
}

export interface OrderStatusSettings {
  statusColors: {
    [key: string]: string; // e.g., { pending: '#f1c40f', completed: '#2ecc71' }
  };
  // Note: Order statuses are managed per order in the order history
  // This only controls the visual appearance of statuses in the UI
}

export interface PaymentSettings {
  defaultMethod: string; // Default payment method for new orders
  methodIcons: {
    [key: string]: string; // e.g., { cash: '💰', card: '💳' }
  };
  methodColors: {
    [key: string]: string; // e.g., { cash: '#2ecc71', card: '#3498db' }
  };
  allowSplitPayments: boolean;
  maxSplitCount: number;
  tipsHandling: 'percentage' | 'fixed' | 'custom';
  defaultTipsPercentage: number;
  // Note: Payment methods are selected per order
  // This only controls the default and visual appearance
}

export interface TableSettings {
  layout: {
    rows: number;
    columns: number;
  };
  statusColors: {
    [key: string]: string; // e.g., { available: '#2ecc71', occupied: '#e74c3c' }
  };
  namingConvention: 'numeric' | 'alphabetical' | 'custom';
  customNames?: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  doNotDisturb: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
  // Note: The following notification features require implementation:
  // - Real-time notification system
  // - WebSocket connection for live updates
  // - Mobile app integration for push notifications
  // - Staff notification preferences
  // - Notification history and management
  notificationGroups: {
    orderUpdates: boolean;
    staffPings: boolean;
    tableStatus: boolean;
    paymentUpdates: boolean;
    inventoryAlerts: boolean;
  };
}

export interface Settings {
  _id?: string;
  taxSettings: TaxSettings;
  loyaltySettings: LoyaltySettings;
  orderSettings: OrderSettings;
  orderStatusSettings: OrderStatusSettings;
  paymentSettings: PaymentSettings;
  tableSettings: TableSettings;
  notificationSettings: NotificationSettings;
  timestamps?: {
    created?: Date;
    updated?: Date;
  };
}

// Default values for settings
export const defaultTaxSettings: TaxSettings = {
  country: '',
  beerTaxRate: 0,
  wineTaxRate: 0,
  spiritsTaxRate: 0,
  isBeerTaxEnabled: true,
  isWineTaxEnabled: true,
  isSpiritsTaxEnabled: true,
};

export const defaultLoyaltySettings: LoyaltySettings = {
  isEnabled: false,
  pointsPerCurrency: 1,
  minimumPointsForRedemption: 100,
  pointsExpirationDays: 365,
};

export const defaultOrderSettings: OrderSettings = {
  defaultPaymentMethods: ['cash', 'card', 'mobile'],
  defaultOrderStatuses: ['pending', 'in_progress', 'completed', 'cancelled'],
  maxTables: 20,
  tableNamingConvention: 'numeric',
  businessName: '',
  businessAddress: '',
  vatNumber: '',
  currency: 'USD',
  timezone: 'UTC',
};

// Default values for new settings
export const defaultOrderStatusSettings: OrderStatusSettings = {
  statusColors: {
    pending: '#f1c40f',
    in_progress: '#3498db',
    completed: '#2ecc71',
    cancelled: '#e74c3c',
  },
};

export const defaultPaymentSettings: PaymentSettings = {
  defaultMethod: 'card',
  methodIcons: {
    cash: '💰',
    card: '💳',
    mobile: '📱',
  },
  methodColors: {
    cash: '#2ecc71',
    card: '#3498db',
    mobile: '#9b59b6',
  },
  allowSplitPayments: true,
  maxSplitCount: 4,
  tipsHandling: 'percentage',
  defaultTipsPercentage: 10,
};

export const defaultTableSettings: TableSettings = {
  layout: {
    rows: 5,
    columns: 4,
  },
  statusColors: {
    available: '#2ecc71',
    occupied: '#e74c3c',
    reserved: '#f1c40f',
    cleaning: '#3498db',
  },
  namingConvention: 'numeric',
};

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  soundEnabled: true,
  soundVolume: 0.7,
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  notificationGroups: {
    orderUpdates: true,
    staffPings: true,
    tableStatus: true,
    paymentUpdates: true,
    inventoryAlerts: true,
  },
};

// List of supported countries with their tax rates
export const supportedCountries = [
  {
    code: 'US',
    name: 'United States',
    defaultBeerTax: 0,
    defaultWineTax: 0,
    defaultSpiritsTax: 0,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    defaultBeerTax: 20,
    defaultWineTax: 20,
    defaultSpiritsTax: 20,
  },
  {
    code: 'DE',
    name: 'Germany',
    defaultBeerTax: 19,
    defaultWineTax: 19,
    defaultSpiritsTax: 19,
  },
  {
    code: 'FR',
    name: 'France',
    defaultBeerTax: 20,
    defaultWineTax: 20,
    defaultSpiritsTax: 20,
  },
  {
    code: 'IT',
    name: 'Italy',
    defaultBeerTax: 22,
    defaultWineTax: 22,
    defaultSpiritsTax: 22,
  },
  {
    code: 'ES',
    name: 'Spain',
    defaultBeerTax: 21,
    defaultWineTax: 21,
    defaultSpiritsTax: 21,
  },
  {
    code: 'SE',
    name: 'Sweden',
    defaultBeerTax: 25,
    defaultWineTax: 25,
    defaultSpiritsTax: 25,
  },
  {
    code: 'NO',
    name: 'Norway',
    defaultBeerTax: 25,
    defaultWineTax: 25,
    defaultSpiritsTax: 25,
  },
  {
    code: 'DK',
    name: 'Denmark',
    defaultBeerTax: 25,
    defaultWineTax: 25,
    defaultSpiritsTax: 25,
  },
  {
    code: 'FI',
    name: 'Finland',
    defaultBeerTax: 24,
    defaultWineTax: 24,
    defaultSpiritsTax: 24,
  },
];

// List of supported currencies
export const supportedCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
];

// List of supported timezones
export const supportedTimezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET)' },
  { value: 'Europe/Oslo', label: 'Oslo (CET)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (CET)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET)' },
];
