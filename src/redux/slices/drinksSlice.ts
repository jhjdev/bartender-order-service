import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Drink } from '../../types/drink';

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
export const fetchDrinks = createAsyncThunk<
  Drink[],
  void,
  { rejectValue: string }
>('drinks/fetchDrinks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Drink[]>('/api/drinks');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch drinks');
  }
});

// Create the slice
const drinksSlice = createSlice({
  name: 'drinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDrinks.fulfilled,
        (state, action: PayloadAction<Drink[]>) => {
          state.loading = false;
          state.drinks = action.payload;
        }
      )
      .addCase(fetchDrinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch drinks';
      });
  },
});

export default drinksSlice.reducer;
