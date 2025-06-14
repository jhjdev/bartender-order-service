import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="h1">{t('home.title', 'Dashboard')}</h1>
        <p className="body mt-2">
          {t('home.description', 'Welcome to your bar management dashboard.')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="body">
          {t('home.comingSoon', 'Dashboard features coming soon.')}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
