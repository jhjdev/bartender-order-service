import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, getProfile } from '../../redux/slices/authSlice';
import { AppDispatch } from '../../redux/store';
import Spinner from '../ui/Spinner';

/**
 * ProtectedRoute component protects routes by checking authentication status
 * and redirecting unauthenticated users to the login page.
 */
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Try to fetch the user profile if we have a token but aren't authenticated yet
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // Attempt to verify token and load profile
      dispatch(getProfile());
    }
  }, [isAuthenticated, loading, dispatch]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to login with the attempted location
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

