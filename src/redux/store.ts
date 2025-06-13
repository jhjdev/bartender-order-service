import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import staffReducer from './slices/staffSlice';
import drinksReducer from './slices/drinksSlice';
import cocktailsReducer from './slices/cocktailsSlice';
import ordersReducer from './slices/ordersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    staff: staffReducer,
    drinks: drinksReducer,
    cocktails: cocktailsReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
