import * as React from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'da';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    const button = buttonRef.current;
    if (button) {
      button.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span className="text-sm font-medium">
          {currentLanguage === 'en' ? 'English' : 'Dansk'}
        </span>
        <svg
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-gray-900 border border-gray-200 z-50">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <button
              onClick={() => handleLanguageChange('en')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === 'en'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('da')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === 'da'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Dansk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
