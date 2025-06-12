import * as React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUser,
  selectIsAuthenticated,
} from './redux/slices/authSlice';
import { AppDispatch } from './redux/store';
import { useTranslation } from 'react-i18next';
import './i18n';

// Import components
import Sidebar from './components/Sidebar';
import UserMenu from './components/auth/UserMenu';
import LanguageSwitcher from './components/common/LanguageSwitcher';
// Import AppRoutes for language-prefixed routing
import AppRoutes from './routes/Routes';
// Import styles
import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { i18n } = useTranslation();
  const location = useLocation();

  // Debug log
  console.log('isAuthenticated:', isAuthenticated);

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Redirect to language-prefixed URL if not present
  useEffect(() => {
    const path = window.location.pathname;
    if (!path.startsWith(`/${i18n.language}`)) {
      const newPath =
        path === '/' ? `/${i18n.language}` : `/${i18n.language}${path}`;
      window.history.replaceState({}, '', newPath);
    }
  }, [i18n.language]);

  // Hide sidebar and header on /login
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="flex h-screen bg-gray-100">
      {!isLoginRoute && isAuthenticated && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!isLoginRoute && (
          <header className="bg-gray-800 text-white shadow-sm z-50 relative">
            <div
              className="flex justify-between items-center px-4"
              style={{ minHeight: '63px' }}
            >
              <div className="flex items-center space-x-4">
                {isAuthenticated && <UserMenu />}
              </div>
              <LanguageSwitcher />
            </div>
          </header>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
