import React from 'react';
import { useTranslation } from 'react-i18next';

const FilesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="h1">{t('navigation.files')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building a comprehensive file management system!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>File upload and storage</li>
              <li>Document organization and categorization</li>
              <li>File sharing and collaboration</li>
              <li>Version control and history</li>
              <li>Search and filtering capabilities</li>
              <li>Access control and permissions</li>
              <li>File preview and editing</li>
              <li>Backup and recovery options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
