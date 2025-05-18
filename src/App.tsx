import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarCollapsed, toggleSidebar } from './redux/slices/uiSlice';
import { selectIsAuthenticated } from './redux/slices/authSlice';
import Sidebar from './components/Sidebar';
import UserMenu from './components/auth/UserMenu';
import AppRoutes from './routes/Routes';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageTransition from './components/ui/PageTransition';
import Spinner from './components/ui/Spinner';

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-2rem)] w-full">
    <Spinner size="lg" />
  </div>
);

// Route loading wrapper
const RouteWrapper = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const isSidebarCollapsed = useSelector(selectSidebarCollapsed);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
        {/* Sidebar */}
        <div
          className={`transform transition-all duration-300 ease-in-out fixed md:relative z-30
            ${
              isMobile && isSidebarCollapsed
                ? '-translate-x-full'
                : 'translate-x-0'
            }
            ${isSidebarCollapsed ? 'w-16' : 'w-64'}
            bg-white shadow-lg md:shadow-md`}
        >
          <Sidebar onClose={() => isMobile && dispatch(toggleSidebar())} />
        </div>

        {/* Overlay */}
        {isMobile && !isSidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out backdrop-blur-sm"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={handleToggleSidebar}
            className="fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-200 shadow-md"
            aria-label={isSidebarCollapsed ? 'Open menu' : 'Close menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {/* Show X icon when sidebar is open, hamburger menu when collapsed */}
              {!isSidebarCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out
            ${isMobile ? 'pt-16 px-2' : ''}
            ${
              !isSidebarCollapsed && !isMobile
                ? 'md:ml-0'
                : isMobile
                ? ''
                : 'md:ml-0'
            }`}
          style={{ transitionProperty: 'margin, padding, width' }}
        >
          {/* Header with UserMenu for authenticated users */}
          {isAuthenticated && (
            <div className="bg-white shadow-sm sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex"></div>
                  <div className="flex items-center">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`p-3 sm:p-4 md:p-6 transition-all duration-300 ease-in-out`}
          >
            <ErrorBoundary>
              <RouteWrapper />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
