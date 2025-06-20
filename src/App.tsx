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
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import NotificationSystem from './components/NotificationSystem';

// Import CSS directly
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Sidebar from './components/layouts/Sidebar';
import Header from './components/layouts/Header';
// Import AppRoutes for language-prefixed routing
import AppRoutes from './routes/Routes';
// Import styles
import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { i18n } = useTranslation();
  const location = useLocation();

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

  // Check if we're on an auth page
  const isAuthPage = location.pathname.includes('/login');

  return (
    <div className="flex h-screen bg-charcoal text-papaya-whip">
      {isAuthenticated && !isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {isAuthenticated && !isAuthPage && <Header />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-papaya-whip text-charcoal">
          <AppRoutes />
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 999999 }}
      />
      <NotificationSystem />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
