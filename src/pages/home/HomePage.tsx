import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.dashboard')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive dashboard with real-time insights!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Real-time sales metrics and KPIs</li>
              <li>Interactive data visualizations with D3.js</li>
              <li>Staff performance tracking</li>
              <li>Inventory status overview</li>
              <li>Customer activity monitoring</li>
              <li>Customizable widget layout</li>
              <li>Quick action shortcuts</li>
              <li>System status monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
