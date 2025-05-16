import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CocktailRecipe } from '../../types/drink';

// Define the state type
interface CocktailsState {
  cocktails: CocktailRecipe[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CocktailsState = {
  cocktails: [],
  loading: false,
  error: null,
};

// Async thunk for fetching cocktails
export const fetchCocktails = createAsyncThunk<
  CocktailRecipe[],
  void,
  { rejectValue: string }
>('cocktails/fetchCocktails', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<CocktailRecipe[]>('/api/cocktails');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch cocktails');
  }
});

// Create the slice
const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCocktails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCocktails.fulfilled,
        (state, action: PayloadAction<CocktailRecipe[]>) => {
          state.loading = false;
          state.cocktails = action.payload;
        }
      )
      .addCase(fetchCocktails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cocktails';
      });
  },
});

export default cocktailsSlice.reducer;
