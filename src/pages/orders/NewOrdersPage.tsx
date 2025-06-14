import React from 'react';
import { useTranslation } from 'react-i18next';
import AddOrder from './AddOrder';

const NewOrdersPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="h1">{t('orders.new.title')}</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="h2">{t('orders.new.subtitle')}</h2>
          <p className="body-small text-gray-500 dark:text-gray-400 mt-1">
            {t('orders.new.description')}
          </p>
        </div>

        <div className="p-6">
          <AddOrder />
        </div>
      </div>
    </div>
  );
};

export default NewOrdersPage;
