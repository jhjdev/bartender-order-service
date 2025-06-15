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
    [key: string]: string;
  };
}

export interface PaymentSettings {
  defaultMethod: string;
  methodIcons: {
    [key: string]: string;
  };
  methodColors: {
    [key: string]: string;
  };
  allowSplitPayments: boolean;
  maxSplitCount: number;
  tipsHandling: 'percentage' | 'fixed' | 'custom';
  defaultTipsPercentage: number;
}

export interface TableSettings {
  layout: {
    rows: number;
    columns: number;
  };
  statusColors: {
    [key: string]: string;
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
    startTime: string;
    endTime: string;
  };
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
