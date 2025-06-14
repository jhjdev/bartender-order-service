import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';
import type { AppDispatch } from '../../redux/store';
import type { User } from '../../types/user';
import ReactDOM from 'react-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';

/**
 * UserMenu component displays the authenticated user's information
 * and provides options like profile access and logout.
 */
const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user) as User;

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

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    const button = buttonRef.current;
    if (button) {
      button.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    }
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed z-[9999]"
        style={{
          top: buttonRect.bottom + window.scrollY + 8,
          right: window.innerWidth - buttonRect.right,
        }}
      >
        <div className="w-48 rounded-md shadow-lg bg-charcoal ring-1 ring-peach/20 text-papaya-whip border border-peach/20">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-papaya-whip hover:text-peach hover:bg-charcoal/80 transition-colors duration-200"
              role="menuitem"
            >
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative flex items-center space-x-4" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center space-x-2 text-papaya-whip hover:text-peach focus:outline-none"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span className="text-sm font-mono bg-charcoal px-4 py-1.5 rounded-full border border-peach/30 text-papaya-whip">
          {user?.firstName}
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
      <LanguageSwitcher />
      {renderDropdown()}
    </div>
  );
};

export default UserMenu;
