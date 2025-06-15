import { useState, useEffect } from 'react';
import {
  Settings,
  TaxSettings,
  LoyaltySettings,
  OrderSettings,
  OrderStatusSettings,
  PaymentSettings,
  TableSettings,
  NotificationSettings,
} from '../../types/settings';
import {
  supportedCountries,
  supportedCurrencies,
  supportedTimezones,
} from '../../types/settings';
import { useToast } from '../../contexts/ToastContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSettings,
  updateSettings,
} from '../../redux/slices/settingsSlice';

// Default values for settings
const defaultTaxSettings: TaxSettings = {
  country: '',
  beerTaxRate: 0,
  wineTaxRate: 0,
  spiritsTaxRate: 0,
  isBeerTaxEnabled: true,
  isWineTaxEnabled: true,
  isSpiritsTaxEnabled: true,
};

const defaultLoyaltySettings: LoyaltySettings = {
  isEnabled: false,
  pointsPerCurrency: 1,
  minimumPointsForRedemption: 100,
  pointsExpirationDays: 365,
};

const defaultOrderSettings: OrderSettings = {
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

const defaultOrderStatusSettings: OrderStatusSettings = {
  statusColors: {
    pending: '#f1c40f',
    in_progress: '#3498db',
    completed: '#2ecc71',
    cancelled: '#e74c3c',
  },
};

const defaultPaymentSettings: PaymentSettings = {
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

const defaultTableSettings: TableSettings = {
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

const defaultNotificationSettings: NotificationSettings = {
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

const createDefaultSettings = (): Settings => ({
  taxSettings: defaultTaxSettings,
  loyaltySettings: defaultLoyaltySettings,
  orderSettings: defaultOrderSettings,
  orderStatusSettings: defaultOrderStatusSettings,
  paymentSettings: defaultPaymentSettings,
  tableSettings: defaultTableSettings,
  notificationSettings: defaultNotificationSettings,
});

export default function SettingsPage() {
  const { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } =
    useToast();
  const dispatch = useAppDispatch();
  const {
    settings,
    loading: isLoading,
    error,
  } = useAppSelector((state) => state.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings>(
    createDefaultSettings()
  );

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const saveSettings = async (newSettings: Settings) => {
    setIsSaving(true);
    try {
      await dispatch(updateSettings(newSettings)).unwrap();
      showSuccessToast('Settings saved successfully');
    } catch (error) {
      showErrorToast('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBusinessNameChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      orderSettings: {
        ...localSettings.orderSettings,
        businessName: value,
      },
    });
  };

  const handleBusinessAddressChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      orderSettings: {
        ...localSettings.orderSettings,
        businessAddress: value,
      },
    });
  };

  const handleVATNumberChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      orderSettings: {
        ...localSettings.orderSettings,
        vatNumber: value,
      },
    });
  };

  const handleCurrencyChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      orderSettings: {
        ...localSettings.orderSettings,
        currency: value,
      },
    });
  };

  const handleTimezoneChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      orderSettings: {
        ...localSettings.orderSettings,
        timezone: value,
      },
    });
  };

  const handleTaxCountryChange = (countryCode: string) => {
    const country = supportedCountries.find((c) => c.code === countryCode);
    if (!country) return;
    setLocalSettings({
      ...localSettings,
      taxSettings: {
        ...localSettings.taxSettings,
        country: countryCode,
        beerTaxRate: country.defaultBeerTax,
        wineTaxRate: country.defaultWineTax,
        spiritsTaxRate: country.defaultSpiritsTax,
      },
    });
  };

  const handleTaxEnabledChange = (
    type: 'beer' | 'wine' | 'spirits',
    checked: boolean
  ) => {
    setLocalSettings({
      ...localSettings,
      taxSettings: {
        ...localSettings.taxSettings,
        [`is${type.charAt(0).toUpperCase() + type.slice(1)}TaxEnabled`]:
          checked,
      } as TaxSettings,
    });
  };

  const handleTaxRateChange = (
    type: 'beer' | 'wine' | 'spirits',
    value: number
  ) => {
    setLocalSettings({
      ...localSettings,
      taxSettings: {
        ...localSettings.taxSettings,
        [`${type}TaxRate`]: value,
      } as TaxSettings,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
          <p className="text-rose-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    taxSettings,
    loyaltySettings,
    orderSettings,
    orderStatusSettings,
    paymentSettings,
    tableSettings,
    notificationSettings,
  } = localSettings;

  // Ensure we have default values if any settings are undefined
  const safeOrderStatusSettings = orderStatusSettings || {
    statusColors: {
      pending: '#f1c40f',
      in_progress: '#3498db',
      completed: '#2ecc71',
      cancelled: '#e74c3c',
    },
  };

  const safePaymentSettings = paymentSettings || {
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

  const safeTableSettings = tableSettings || {
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

  const safeNotificationSettings = notificationSettings || {
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

  const safeTaxSettings = taxSettings || {
    country: '',
    beerTaxRate: 0,
    wineTaxRate: 0,
    spiritsTaxRate: 0,
    isBeerTaxEnabled: true,
    isWineTaxEnabled: true,
    isSpiritsTaxEnabled: true,
  };

  const getTaxEnabledKey = (type: 'beer' | 'wine' | 'spirits') =>
    `is${
      type.charAt(0).toUpperCase() + type.slice(1)
    }TaxEnabled` as keyof TaxSettings;

  const getTaxRateKey = (type: 'beer' | 'wine' | 'spirits') =>
    `${type}TaxRate` as keyof TaxSettings;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="h1">Settings</h1>
        <p className="body mt-2">Manage your application settings.</p>
      </div>

      {/* Tax Settings */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-rose-600">Tax Settings</h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-rose-600">Country</label>
            <select
              value={safeTaxSettings.country}
              onChange={(e) => handleTaxCountryChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
              aria-label="Select country"
            >
              <option value="" className="text-gray-900">
                Select a country
              </option>
              {supportedCountries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="text-gray-900"
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['beer', 'wine', 'spirits'] as const).map((type) => (
              <div key={type}>
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-rose-600 capitalize">
                    {type} Tax
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(safeTaxSettings[getTaxEnabledKey(type)])}
                      onChange={(e) =>
                        handleTaxEnabledChange(type, e.target.checked)
                      }
                      className="rounded border-rose-300 text-rose-600 shadow-sm focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200"
                      aria-label={`Enable ${type} tax`}
                    />
                    <span className="ml-2 text-sm text-rose-600">Enabled</span>
                  </div>
                </div>
                <input
                  type="number"
                  value={Number(safeTaxSettings[getTaxRateKey(type)]) || ''}
                  onChange={(e) =>
                    handleTaxRateChange(type, parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={!safeTaxSettings[getTaxEnabledKey(type)]}
                  aria-label={`${type} tax rate`}
                  placeholder="Enter tax rate"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loyalty Settings */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg shadow-lg p-6 mb-6 border border-violet-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-purple-600">
            Loyalty Settings
          </h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={loyaltySettings.isEnabled}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  loyaltySettings: {
                    ...localSettings.loyaltySettings,
                    isEnabled: e.target.checked,
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="rounded border-purple-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
              aria-label="Enable loyalty program"
            />
            <label className="ml-2 block text-sm text-purple-600">
              Enable Loyalty Program
            </label>
          </div>

          {loyaltySettings.isEnabled && (
            <>
              <div>
                <label className="block text-sm text-purple-600">
                  Points per Currency Unit
                </label>
                <input
                  type="number"
                  value={loyaltySettings.pointsPerCurrency}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      loyaltySettings: {
                        ...localSettings.loyaltySettings,
                        pointsPerCurrency: parseInt(e.target.value),
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="1"
                  aria-label="Points per currency unit"
                  placeholder="Enter points per currency unit"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-600">
                  Minimum Points for Redemption
                </label>
                <input
                  type="number"
                  value={loyaltySettings.minimumPointsForRedemption}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      loyaltySettings: {
                        ...localSettings.loyaltySettings,
                        minimumPointsForRedemption: parseInt(e.target.value),
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="1"
                  aria-label="Minimum points for redemption"
                  placeholder="Enter minimum points for redemption"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-600">
                  Points Expiration (days)
                </label>
                <input
                  type="number"
                  value={loyaltySettings.pointsExpirationDays}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      loyaltySettings: {
                        ...localSettings.loyaltySettings,
                        pointsExpirationDays: parseInt(e.target.value),
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="1"
                  aria-label="Points expiration in days"
                  placeholder="Enter points expiration in days"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Settings */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg shadow-lg p-6 mb-6 border border-rose-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-rose-600">Order Settings</h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-700">
              Business Name
            </label>
            <input
              type="text"
              value={orderSettings.businessName}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
              placeholder="Enter business name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-700">
              Business Address
            </label>
            <input
              type="text"
              value={orderSettings.businessAddress}
              onChange={(e) => handleBusinessAddressChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
              placeholder="Enter business address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-700">
              VAT Number
            </label>
            <input
              type="text"
              value={orderSettings.vatNumber}
              onChange={(e) => handleVATNumberChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
              placeholder="Enter VAT number"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-rose-700">
                Currency
              </label>
              <select
                value={orderSettings.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
                aria-label="Select currency"
              >
                {supportedCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-700">
                Timezone
              </label>
              <select
                value={orderSettings.timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border-rose-200 bg-white/50 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition-colors duration-200 text-gray-900"
                aria-label="Select timezone"
              >
                {supportedTimezones.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Settings */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-lg p-6 mb-6 border border-sky-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-blue-600">
            Order Status Settings
          </h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-blue-600">Status Colors</label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              {Object.entries(safeOrderStatusSettings.statusColors).map(
                ([status, color]) => (
                  <div key={status}>
                    <label className="block text-xs text-blue-600 capitalize">
                      {status.replace('_', ' ')}
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            orderStatusSettings: {
                              ...localSettings.orderStatusSettings,
                              statusColors: {
                                ...localSettings.orderStatusSettings
                                  .statusColors,
                                [status]: e.target.value,
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                        }}
                        className="h-8 w-8 rounded-lg border-blue-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        aria-label={`${status} color`}
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newSettings = {
                            ...localSettings,
                            orderStatusSettings: {
                              ...localSettings.orderStatusSettings,
                              statusColors: {
                                ...localSettings.orderStatusSettings
                                  .statusColors,
                                [status]: e.target.value,
                              },
                            },
                          };
                          setLocalSettings(newSettings);
                        }}
                        className="block w-full rounded-lg border-blue-200 bg-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200 text-gray-900"
                        aria-label={`${status} color hex value`}
                        placeholder="Enter hex color"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Settings */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 mb-6 border border-indigo-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-indigo-600">
            Table Settings
          </h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-indigo-600">
              Table Layout
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-indigo-600">Rows</label>
                <input
                  type="number"
                  value={safeTableSettings.layout.rows}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      tableSettings: {
                        ...localSettings.tableSettings,
                        layout: {
                          ...localSettings.tableSettings.layout,
                          rows: parseInt(e.target.value),
                        },
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-indigo-200 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="1"
                  max="10"
                  aria-label="Number of table rows"
                  placeholder="Enter number of rows"
                />
              </div>
              <div>
                <label className="block text-xs text-indigo-600">Columns</label>
                <input
                  type="number"
                  value={safeTableSettings.layout.columns}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      tableSettings: {
                        ...localSettings.tableSettings,
                        layout: {
                          ...localSettings.tableSettings.layout,
                          columns: parseInt(e.target.value),
                        },
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-indigo-200 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  min="1"
                  max="10"
                  aria-label="Number of table columns"
                  placeholder="Enter number of columns"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-indigo-600">
              Table Naming Convention
            </label>
            <select
              value={safeTableSettings.namingConvention}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  tableSettings: {
                    ...localSettings.tableSettings,
                    namingConvention: e.target.value as
                      | 'numeric'
                      | 'alphabetical'
                      | 'custom',
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="mt-1 block w-full rounded-lg border-indigo-200 bg-white/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200 text-gray-900"
              aria-label="Table naming convention"
            >
              <option value="numeric" className="text-gray-900">
                Numeric (1, 2, 3...)
              </option>
              <option value="alphabetical" className="text-gray-900">
                Alphabetical (A, B, C...)
              </option>
              <option value="custom" className="text-gray-900">
                Custom Names
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-lg p-6 mb-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-emerald-600">
            Payment Settings
          </h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-emerald-600">
              Default Payment Method
            </label>
            <select
              value={safePaymentSettings.defaultMethod}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  paymentSettings: {
                    ...localSettings.paymentSettings,
                    defaultMethod: e.target.value,
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="mt-1 block w-full rounded-lg border-emerald-200 bg-white/50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-colors duration-200 text-gray-900"
              aria-label="Default payment method"
            >
              <option value="cash" className="text-gray-900">
                Cash
              </option>
              <option value="card" className="text-gray-900">
                Card
              </option>
              <option value="mobile" className="text-gray-900">
                Mobile Payment
              </option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={safePaymentSettings.allowSplitPayments}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  paymentSettings: {
                    ...localSettings.paymentSettings,
                    allowSplitPayments: e.target.checked,
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="rounded border-emerald-300 text-emerald-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200"
              aria-label="Allow split payments"
            />
            <label className="ml-2 block text-sm text-emerald-600">
              Allow split payments
            </label>
          </div>

          {safePaymentSettings.allowSplitPayments && (
            <div className="mt-2">
              <label className="block text-sm text-emerald-600">
                Maximum number of splits
              </label>
              <input
                type="number"
                value={safePaymentSettings.maxSplitCount}
                onChange={(e) => {
                  const newSettings = {
                    ...localSettings,
                    paymentSettings: {
                      ...localSettings.paymentSettings,
                      maxSplitCount: parseInt(e.target.value),
                    },
                  };
                  setLocalSettings(newSettings);
                }}
                className="mt-1 block w-full rounded-lg border-emerald-200 bg-white/50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-colors duration-200 text-gray-900"
                min="2"
                aria-label="Maximum number of payment splits"
                placeholder="Enter maximum number of splits"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-emerald-600">
              Tips Handling
            </label>
            <select
              value={safePaymentSettings.tipsHandling}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  paymentSettings: {
                    ...localSettings.paymentSettings,
                    tipsHandling: e.target.value as
                      | 'custom'
                      | 'percentage'
                      | 'fixed',
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="mt-1 block w-full rounded-lg border-emerald-200 bg-white/50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-colors duration-200 text-gray-900"
              aria-label="Tips handling method"
            >
              <option value="percentage" className="text-gray-900">
                Percentage
              </option>
              <option value="fixed" className="text-gray-900">
                Fixed Amount
              </option>
              <option value="custom" className="text-gray-900">
                Custom
              </option>
            </select>
          </div>

          {safePaymentSettings.tipsHandling === 'percentage' && (
            <div className="mt-2">
              <label className="block text-sm text-emerald-600">
                Default tips percentage
              </label>
              <input
                type="number"
                value={safePaymentSettings.defaultTipsPercentage}
                onChange={(e) => {
                  const newSettings = {
                    ...localSettings,
                    paymentSettings: {
                      ...localSettings.paymentSettings,
                      defaultTipsPercentage: parseInt(e.target.value),
                    },
                  };
                  setLocalSettings(newSettings);
                }}
                className="mt-1 block w-full rounded-lg border-emerald-200 bg-white/50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-colors duration-200 text-gray-900"
                min="0"
                max="100"
                aria-label="Default tips percentage"
                placeholder="Enter default tips percentage"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-lg p-6 mb-6 border border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-amber-600">
            Notification Settings
          </h3>
          <button
            onClick={() => saveSettings(localSettings)}
            disabled={isSaving}
            className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={safeNotificationSettings.soundEnabled}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    soundEnabled: e.target.checked,
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="rounded border-amber-300 text-amber-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
              aria-label="Enable notification sounds"
            />
            <label className="ml-2 block text-sm text-amber-600">
              Enable notification sounds
            </label>
          </div>

          {safeNotificationSettings.soundEnabled && (
            <div>
              <label className="block text-sm text-amber-600">
                Sound Volume
              </label>
              <input
                type="range"
                value={safeNotificationSettings.soundVolume}
                onChange={(e) => {
                  const newSettings = {
                    ...localSettings,
                    notificationSettings: {
                      ...localSettings.notificationSettings,
                      soundVolume: parseFloat(e.target.value),
                    },
                  };
                  setLocalSettings(newSettings);
                }}
                min="0"
                max="1"
                step="0.1"
                className="mt-1 block w-full rounded-lg border-amber-200 bg-white/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                aria-label="Notification sound volume"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={safeNotificationSettings.doNotDisturb.enabled}
              onChange={(e) => {
                const newSettings = {
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    doNotDisturb: {
                      ...localSettings.notificationSettings.doNotDisturb,
                      enabled: e.target.checked,
                    },
                  },
                };
                setLocalSettings(newSettings);
              }}
              className="rounded border-amber-300 text-amber-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
              aria-label="Enable do not disturb"
            />
            <label className="ml-2 block text-sm text-amber-600">
              Enable Do Not Disturb
            </label>
          </div>

          {safeNotificationSettings.doNotDisturb.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-amber-600">
                  Start Time
                </label>
                <input
                  type="time"
                  value={safeNotificationSettings.doNotDisturb.startTime}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      notificationSettings: {
                        ...localSettings.notificationSettings,
                        doNotDisturb: {
                          ...localSettings.notificationSettings.doNotDisturb,
                          startTime: e.target.value,
                        },
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-amber-200 bg-white/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  aria-label="Do not disturb start time"
                />
              </div>
              <div>
                <label className="block text-sm text-amber-600">End Time</label>
                <input
                  type="time"
                  value={safeNotificationSettings.doNotDisturb.endTime}
                  onChange={(e) => {
                    const newSettings = {
                      ...localSettings,
                      notificationSettings: {
                        ...localSettings.notificationSettings,
                        doNotDisturb: {
                          ...localSettings.notificationSettings.doNotDisturb,
                          endTime: e.target.value,
                        },
                      },
                    };
                    setLocalSettings(newSettings);
                  }}
                  className="mt-1 block w-full rounded-lg border-amber-200 bg-white/50 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm transition-colors duration-200 text-gray-900"
                  aria-label="Do not disturb end time"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="h2 mb-4">Toast Test Buttons</h2>
        <div className="space-y-4">
          <button
            onClick={() => showSuccessToast('Success message')}
            className="bg-[#4a7b6f] hover:bg-[#3D665C] text-white font-bold py-2 px-4 rounded mr-4"
          >
            Test Success Toast
          </button>
          <button
            onClick={() => showErrorToast('Error message')}
            className="form-button-danger font-bold py-2 px-4 rounded mr-4"
          >
            Test Error Toast
          </button>
          <button
            onClick={() => showWarningToast('Warning message')}
            className="form-button-warning font-bold py-2 px-4 rounded mr-4"
          >
            Test Warning Toast
          </button>
          <button
            onClick={() => showInfoToast('Info message')}
            className="form-button-primary font-bold py-2 px-4 rounded"
          >
            Test Info Toast
          </button>
        </div>
      </div>
    </div>
  );
}
