import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import ProfilePage from '../pages/profile/ProfilePage';
import DrinksPage from '../pages/menu/DrinksPage';
import CocktailsPage from '../pages/menu/CocktailsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import AddOrder from '../pages/orders/AddOrder';
import StaffPage from '../pages/staff/StaffPage';
import TablesPage from '../pages/tables/TablesPage';
import ReportsPage from '../pages/reports/ReportsPage';
import FilesPage from '../pages/files/FilesPage';
import SchedulePage from '../pages/schedule/SchedulePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/profile" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/drinks"
        element={
          <ProtectedRoute>
            <DrinksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu/cocktails"
        element={
          <ProtectedRoute>
            <CocktailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-order"
        element={
          <ProtectedRoute>
            <AddOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <TablesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <FilesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};

export default AppRoutes;
