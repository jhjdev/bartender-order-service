import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Types matching backend
export interface Admin {
  _id: string;
  email: string;
  name: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthState {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initRequired: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initRequired: false
};

// Load token from localStorage
const loadAuthState = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return {};
    
    return {
      token,
      isAuthenticated: true
    };
  } catch (error) {
    return {};
  }
};

// Initialize state with stored token
const persistedState = loadAuthState();
const authInitialState = {
  ...initialState,
  ...persistedState
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      // Set auth header if token exists
      if (auth.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
      }
      
      const response = await axios.get('/api/auth/profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Clear token on auth failure
        localStorage.removeItem('token');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/change-password', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const initializeAdmin = createAsyncThunk(
  'auth/initializeAdmin',
  async (adminData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/init', adminData);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize admin');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logout: (state) => {
      // Remove token from localStorage
      localStorage.removeItem('token');
      // Remove auth header
      delete axios.defaults.headers.common['Authorization'];
      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.admin;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Profile cases
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // If unauthorized, clear auth state
        if (action.payload === 'Authentication required' || action.payload === 'Invalid authentication token') {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })
      
      // Change Password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Initialize Admin cases
      .addCase(initializeAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.admin;
        state.initRequired = false;
      })
      .addCase(initializeAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // If admin already exists, set initRequired to false
        if (action.payload === 'Admin already initialized') {
          state.initRequired = false;
        }
      });
  },
});

// Export actions
export const { logout, clearAuthError } = authSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

