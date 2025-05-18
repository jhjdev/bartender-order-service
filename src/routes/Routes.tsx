import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Orders from '../pages/Orders';
import AddOrder from '../pages/AddOrder';
import DrinksPage from '../pages/menu/DrinksPage';
import CocktailsPage from '../pages/menu/CocktailsPage';
import StaffPage from '../pages/staff/StaffPage';
import SchedulePage from '../pages/schedule/SchedulePage';
import TablesPage from '../pages/TablesPage';
import ReportsPage from '../pages/reports/ReportsPage';
import FilesPage from '../pages/files/FilesPage';
import ProfilePage from '../pages/Profile';
import ErrorPage from '../pages/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/error" element={<ErrorPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Menu Routes */}
        <Route path="/menu/drinks" element={<DrinksPage />} />
        <Route path="/menu/cocktails" element={<CocktailsPage />} />

        {/* Order Routes */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/add-order" element={<AddOrder />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/schedule" element={<SchedulePage />} />

        {/* Other Routes */}
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
