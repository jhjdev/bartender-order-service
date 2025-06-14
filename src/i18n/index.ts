import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locale/en/translation.json';
import daTranslations from './locale/da/translation.json';

// Initialize i18next
i18n
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
    lng: 'en', // default language
    fallbackLng: 'en',
    detection: {
      order: ['path', 'navigator', 'localStorage'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Add event listener for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  localStorage.setItem('i18nextLng', lng);
});

// Log the current language and available resources for debugging
console.log('Current language:', i18n.language);
console.log('Available languages:', Object.keys(i18n.options.resources || {}));

export default i18n;
