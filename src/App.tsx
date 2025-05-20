import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/Routes';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1 flex flex-col h-screen">
        {isAuthenticated && (
          <header className="bg-white shadow-sm h-16 flex items-center px-6">
            <h1 className="text-xl font-semibold text-gray-800">Bar Manager</h1>
          </header>
        )}
        <main className="flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
