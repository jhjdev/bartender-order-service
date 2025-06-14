import React from 'react';
import { useTranslation } from 'react-i18next';

const InventoryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="h1 mb-2">{t('inventory.title')}</h1>
        <p className="body mb-6">{t('inventory.description')}</p>
        <div className="text-center py-8">
          <p className="body">{t('inventory.comingSoon')}</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
