import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import AuthLayout from '../components/layouts/AuthLayout';
import LanguageRedirect from '../components/common/LanguageRedirect';
import LoginPage from '../pages/auth/LoginPage';
import DrinksPage from '../pages/menu/DrinksPage';
import CocktailsPage from '../pages/menu/CocktailsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import AddOrder from '../pages/orders/AddOrder';
import TablesPage from '../pages/tables/TablesPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SchedulePage from '../pages/schedule/SchedulePage';
import ProfilePage from '../pages/profile/ProfilePage';
import StaffPage from '../pages/staff/StaffPage';
import FilesPage from '../pages/files/FilesPage';
import ErrorPage from '../pages/ErrorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LanguageRedirect />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/:lang/login" element={<LoginPage />} />
        {/* Add more auth routes here later (register, password reset, etc.) */}
      </Route>

      {/* Protected routes */}
      <Route
        path=":lang/menu/drinks"
        element={
          <ProtectedRoute>
            <DrinksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/menu/cocktails"
        element={
          <ProtectedRoute>
            <CocktailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":lang/add-order"
        element={
          <ProtectedRoute>
            <AddOrder />
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
      <Route
        path=":lang/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
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
        path=":lang/staff"
        element={
          <ProtectedRoute>
            <StaffPage />
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
        path="*"
        element={
          <ErrorPage
            title="Page not found"
            message="Sorry, we couldn't find the page you're looking for."
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
