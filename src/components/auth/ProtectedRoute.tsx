import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthInitialized,
  selectAuthError,
  setInitialized,
} from '../../redux/slices/authSlice';
import { AppDispatch } from '../../redux/store';
import { authService } from '../../services/authService';
import Spinner from '../ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component protects routes by checking authentication status
 * and redirecting unauthenticated users to the login page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectAuthInitialized);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    const token = authService.getToken();

    // If no token, we're definitely not authenticated
    if (!token) {
      dispatch(setInitialized());
      return;
    }

    // If we're already authenticated, we're done
    if (isAuthenticated) {
      dispatch(setInitialized());
      return;
    }

    // If we're loading or initialized, don't do anything
    if (loading || initialized) {
      return;
    }

    // Try to get the current user
    dispatch(getCurrentUser())
      .unwrap()
      .then(() => {
        dispatch(setInitialized());
      })
      .catch((error) => {
        console.error('Failed to get current user:', error);
        // Clear token and redirect to login if there's any error
        authService.removeToken();
        dispatch(setInitialized());
      });
  }, [dispatch, isAuthenticated, loading, initialized]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
