import React from 'react';
import { useTranslation } from 'react-i18next';

const CustomerProfiles: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t('navigation.customerProfiles')}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive customer management system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Customer profile management</li>
              <li>Purchase history tracking</li>
              <li>Favorite items and preferences</li>
              <li>Dietary restrictions and allergies</li>
              <li>VIP status and special occasions</li>
              <li>Customer notes and tags</li>
              <li>Communication preferences</li>
              <li>Customer segmentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfiles;
