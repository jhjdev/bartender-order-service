import React from 'react';
import { useTranslation } from 'react-i18next';

const SchedulePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.schedule')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive scheduling system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Staff scheduling and management</li>
              <li>Shift planning and rotation</li>
              <li>Time-off requests and approvals</li>
              <li>Schedule conflict detection</li>
              <li>Calendar view with D3.js</li>
              <li>Mobile-friendly interface</li>
              <li>Automated schedule generation</li>
              <li>Schedule notifications and reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
