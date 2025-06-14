import React from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../utils/toast';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="h1">{t('settings.title', 'Settings')}</h1>
        <p className="body mt-2">
          {t('settings.description', 'Manage your application settings.')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="body">
          {t('settings.comingSoon', 'Settings features coming soon.')}
        </p>
      </div>

      {/* Toast Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="h2 mb-4">Toast Message Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() =>
              showToast.success('Operation completed successfully!')
            }
            className="form-button form-button-secondary"
          >
            Success Toast
          </button>
          <button
            onClick={() => showToast.error('An error occurred!')}
            className="form-button form-button-danger"
          >
            Error Toast
          </button>
          <button
            onClick={() => showToast.info('Here is some information.')}
            className="form-button form-button-primary"
          >
            Info Toast
          </button>
          <button
            onClick={() => showToast.warning('Please be careful!')}
            className="form-button form-button-warning"
          >
            Warning Toast
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
