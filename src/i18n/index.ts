import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslations from './locales/en.json';
import daTranslations from './locales/da.json';

// Get language from URL or default to 'en'
const getLanguageFromUrl = () => {
  const path = window.location.pathname;
  const langMatch = path.match(/^\/(en|da)/);
  return langMatch ? langMatch[1] : 'en';
};

// Update URL when language changes
const updateUrl = (lng: string) => {
  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(/^\/(en|da)/, '') || '/';
  window.history.replaceState({}, '', `/${lng}${newPath}`);
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      da: {
        translation: daTranslations,
      },
    },
    lng: getLanguageFromUrl(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

// Update URL when language changes
i18n.on('languageChanged', (lng) => {
  updateUrl(lng);
});

export default i18n;
