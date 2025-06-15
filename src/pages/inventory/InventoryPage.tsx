import React from 'react';
import { useTranslation } from 'react-i18next';

const InventoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.inventory')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive inventory management system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Stock tracking and management</li>
              <li>Low stock alerts and notifications</li>
              <li>Inventory analytics and reporting</li>
              <li>Supplier management</li>
              <li>Purchase order system</li>
              <li>Barcode scanning support</li>
              <li>Inventory forecasting</li>
              <li>Waste tracking and management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
