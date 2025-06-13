import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Drink } from '../../types/drink';
import { drinkService } from '../../services/drinkService';
import { toast } from 'react-toastify';

// Define the state type
interface DrinksState {
  drinks: Drink[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DrinksState = {
  drinks: [],
  loading: false,
  error: null,
};

// Async thunk for fetching drinks
export const fetchDrinks = createAsyncThunk(
  'drinks/fetchDrinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await drinkService.getAllDrinks();
      return response;
    } catch (error) {
      toast.error('Failed to fetch drinks', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to fetch drinks');
    }
  }
);

export const createDrink = createAsyncThunk(
  'drinks/createDrink',
  async (drinkData: Partial<Drink>) => {
    const response = await drinkService.createDrink(drinkData);
    return response;
  }
);

export const updateDrink = createAsyncThunk(
  'drinks/updateDrink',
  async (
    { id, drinkData }: { id: string; drinkData: Partial<Drink> },
    { rejectWithValue }
  ) => {
    try {
      const response = await drinkService.updateDrink(id, drinkData);
      toast.success('Drink updated successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return response;
    } catch (error) {
      toast.error('Failed to update drink', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to update drink');
    }
  }
);

export const deleteDrink = createAsyncThunk(
  'drinks/deleteDrink',
  async (id: string, { rejectWithValue }) => {
    try {
      await drinkService.deleteDrink(id);
      toast.success('Drink deleted successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return id;
    } catch (error) {
      toast.error('Failed to delete drink', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to delete drink');
    }
  }
);

// Create the slice
const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch drinks
      .addCase(fetchDrinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrinks.fulfilled, (state, action) => {
        state.loading = false;
        state.drinks = action.payload;
        state.error = null;
      })
      .addCase(fetchDrinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create drink
      .addCase(createDrink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDrink.fulfilled, (state, action) => {
        state.loading = false;
        state.drinks.push(action.payload);
      })
      .addCase(createDrink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create drink';
      })
      // Update drink
      .addCase(updateDrink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDrink.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.drinks.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.drinks[index] = action.payload;
        }
      })
      .addCase(updateDrink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete drink
      .addCase(deleteDrink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDrink.fulfilled, (state, action) => {
        state.loading = false;
        state.drinks = state.drinks.filter((d) => d._id !== action.payload);
      })
      .addCase(deleteDrink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default drinksSlice.reducer;
