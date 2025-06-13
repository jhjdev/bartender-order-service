import React from 'react';
import { Outlet } from 'react-router-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-end">
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
