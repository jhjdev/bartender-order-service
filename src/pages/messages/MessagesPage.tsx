import React from 'react';
import { useTranslation } from 'react-i18next';

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.messages')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive messaging system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Real-time messaging between staff</li>
              <li>Customer communication tools</li>
              <li>Message templates and quick replies</li>
              <li>Notification center</li>
              <li>Message history and search</li>
              <li>File sharing capabilities</li>
              <li>Group messaging</li>
              <li>Message scheduling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
