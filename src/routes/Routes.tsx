import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import OrdersHistoryPage from '../pages/orders/OrdersHistoryPage';
import NewOrdersPage from '../pages/orders/NewOrdersPage';
import FilesPage from '../pages/files/FilesPage';
import ErrorPage from '../pages/ErrorPage';
import StaffPage from '../pages/staff/StaffPage';
import TablesPage from '../pages/tables/TablesPage';
import CocktailsPage from '../pages/menu/CocktailsPage';
import DrinksPage from '../pages/menu/DrinksPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SchedulePage from '../pages/schedule/SchedulePage';
import MessagePage from '../pages/messages/MessagePage';
import HomePage from '../pages/home/HomePage';
import SettingsPage from '../pages/settings/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import LoyaltyProgram from '../pages/customers/LoyaltyProgram';
import CustomerProfiles from '../pages/customers/CustomerProfiles';
import LoyaltyReports from '../pages/customers/LoyaltyReports';
import { useTranslation } from 'react-i18next';

const AppRoutes: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${i18n.language}/home`} replace />}
      />
      <Route path="/:lang" element={<Navigate to="home" replace />} />

      {/* Auth Routes */}
      <Route path=":lang/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path=":lang/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/orders"
        element={
          <ProtectedRoute>
            <OrdersHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/orders/new"
        element={
          <ProtectedRoute>
            <NewOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/files"
        element={
          <ProtectedRoute>
            <FilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/staff"
        element={
          <ProtectedRoute>
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/tables"
        element={
          <ProtectedRoute>
            <TablesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/cocktails"
        element={
          <ProtectedRoute>
            <CocktailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/drinks"
        element={
          <ProtectedRoute>
            <DrinksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/messages"
        element={
          <ProtectedRoute>
            <MessagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* CRM Routes */}
      <Route
        path=":lang/loyalty"
        element={
          <ProtectedRoute>
            <LoyaltyProgram />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/customers"
        element={
          <ProtectedRoute>
            <CustomerProfiles />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/loyalty-reports"
        element={
          <ProtectedRoute>
            <LoyaltyReports />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
