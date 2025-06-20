import React from 'react';
import { useTranslation } from 'react-i18next';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.reports')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive reporting system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sales analytics and trends</li>
              <li>Inventory tracking and forecasting</li>
              <li>Staff performance metrics</li>
              <li>Customer behavior analysis</li>
              <li>Custom report builder</li>
              <li>Data visualization with D3.js</li>
              <li>Export to PDF and Excel</li>
              <li>Scheduled report generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
