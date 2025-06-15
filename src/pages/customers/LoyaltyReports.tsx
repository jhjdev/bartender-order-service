import React from 'react';
import { useTranslation } from 'react-i18next';

const LoyaltyReports: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t('navigation.loyaltyReports')}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building powerful analytics and reporting tools!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Customer lifetime value analysis</li>
              <li>Spending patterns and trends</li>
              <li>Visit frequency analysis</li>
              <li>Popular items by customer segment</li>
              <li>Points earning and redemption analytics</li>
              <li>Customer retention metrics</li>
              <li>Churn analysis and prediction</li>
              <li>Custom report builder</li>
              <li>Export capabilities (CSV, PDF)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyReports;
