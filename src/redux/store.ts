import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import drinksReducer from './slices/drinksSlice';
import cocktailsReducer from './slices/cocktailsSlice';
import staffReducer from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    ui: uiReducer,
    auth: authReducer,
    drinks: drinksReducer,
    cocktails: cocktailsReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
