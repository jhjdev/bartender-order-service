import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UiState {
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false, // Default expanded
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed } = uiSlice.actions;

// Selectors
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;

export default uiSlice.reducer;

