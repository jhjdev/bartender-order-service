import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CocktailRecipe } from '../../types/drink';
import { cocktailService } from '../../services/cocktailService';

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
export const fetchCocktails = createAsyncThunk(
  'cocktails/fetchCocktails',
  async () => {
    const response = await cocktailService.getAllCocktails();
    return response;
  }
);

export const createCocktail = createAsyncThunk(
  'cocktails/createCocktail',
  async (cocktailData: Partial<CocktailRecipe>) => {
    const response = await cocktailService.createCocktail(cocktailData);
    return response;
  }
);

export const updateCocktail = createAsyncThunk(
  'cocktails/updateCocktail',
  async ({
    id,
    cocktailData,
  }: {
    id: string;
    cocktailData: Partial<CocktailRecipe>;
  }) => {
    const response = await cocktailService.updateCocktail(id, cocktailData);
    return response;
  }
);

export const deleteCocktail = createAsyncThunk(
  'cocktails/deleteCocktail',
  async (id: string) => {
    await cocktailService.deleteCocktail(id);
    return id;
  }
);

// Create the slice
const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cocktails
      .addCase(fetchCocktails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCocktails.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = action.payload;
      })
      .addCase(fetchCocktails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cocktails';
      })
      // Create cocktail
      .addCase(createCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCocktail.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails.push(action.payload);
      })
      .addCase(createCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create cocktail';
      })
      // Update cocktail
      .addCase(updateCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCocktail.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cocktails.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.cocktails[index] = action.payload;
        }
      })
      .addCase(updateCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update cocktail';
      })
      // Delete cocktail
      .addCase(deleteCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCocktail.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = state.cocktails.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete cocktail';
      });
  },
});

export default cocktailsSlice.reducer;
