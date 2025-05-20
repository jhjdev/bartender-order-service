import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Drink } from '../../types/drink';
import { drinkService } from '../../services/drinkService';

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
export const fetchDrinks = createAsyncThunk('drinks/fetchDrinks', async () => {
  const response = await drinkService.getAllDrinks();
  return response;
});

export const createDrink = createAsyncThunk(
  'drinks/createDrink',
  async (drinkData: Partial<Drink>) => {
    const response = await drinkService.createDrink(drinkData);
    return response;
  }
);

export const updateDrink = createAsyncThunk(
  'drinks/updateDrink',
  async ({ id, drinkData }: { id: string; drinkData: Partial<Drink> }) => {
    const response = await drinkService.updateDrink(id, drinkData);
    return response;
  }
);

export const deleteDrink = createAsyncThunk(
  'drinks/deleteDrink',
  async (id: string) => {
    await drinkService.deleteDrink(id);
    return id;
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
      })
      .addCase(fetchDrinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch drinks';
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
        state.error = action.error.message || 'Failed to update drink';
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
        state.error = action.error.message || 'Failed to delete drink';
      });
  },
});

export default drinksSlice.reducer;
