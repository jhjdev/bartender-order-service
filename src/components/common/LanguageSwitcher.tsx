import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import i18n from '../../i18n';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Update current language when i18n language changes
    const handleLanguageChange = (lng: string) => {
      console.log('Language changed to:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = async (language: string) => {
    try {
      console.log('Changing language to:', language);
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);

      // Update URL path
      const currentPath = location.pathname;
      const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${language}`);
      console.log('Updating path from', currentPath, 'to', newPath);
      navigate(newPath);

      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderDropdown = () => {
    if (!isOpen || !buttonRef.current) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownStyle = {
      position: 'fixed' as const,
      top: buttonRect.bottom + window.scrollY + 8,
      right: window.innerWidth - buttonRect.right,
      zIndex: 99999,
    };

    return ReactDOM.createPortal(
      <div style={dropdownStyle}>
        <div className="w-48 rounded-md shadow-lg bg-charcoal ring-1 ring-peach/20 text-papaya-whip border border-peach/20">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <button
              onClick={() => handleLanguageChange('en')}
              className={`block w-full text-left px-4 py-2 text-sm text-papaya-whip hover:text-peach hover:bg-charcoal/80 transition-colors duration-200 ${
                currentLanguage === 'en' ? 'bg-charcoal/80 text-peach' : ''
              }`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('da')}
              className={`block w-full text-left px-4 py-2 text-sm text-papaya-whip hover:text-peach hover:bg-charcoal/80 transition-colors duration-200 ${
                currentLanguage === 'da' ? 'bg-charcoal/80 text-peach' : ''
              }`}
              role="menuitem"
            >
              Dansk
            </button>
            <button
              onClick={() => handleLanguageChange('sv')}
              className={`block w-full text-left px-4 py-2 text-sm text-papaya-whip hover:text-peach hover:bg-charcoal/80 transition-colors duration-200 ${
                currentLanguage === 'sv' ? 'bg-charcoal/80 text-peach' : ''
              }`}
              role="menuitem"
            >
              Svenska
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
      >
        <span className="text-sm font-mono bg-charcoal px-4 py-1.5 rounded-full border border-peach/30 text-papaya-whip">
          {currentLanguage.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform text-papaya-whip ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {renderDropdown()}
    </div>
  );
};

export default LanguageSwitcher;
