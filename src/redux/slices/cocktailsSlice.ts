import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cocktailService } from '../../services/cocktailService';
import { CocktailRecipe } from '../../types/drink';
import { toast } from 'react-toastify';

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await cocktailService.getAllCocktails();
      return response;
    } catch (error) {
      toast.error('Failed to fetch cocktails', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to fetch cocktails');
    }
  }
);

export const addCocktail = createAsyncThunk(
  'cocktails/addCocktail',
  async (cocktailData: Partial<CocktailRecipe>, { rejectWithValue }) => {
    try {
      const response = await cocktailService.createCocktail(cocktailData);
      toast.success('Cocktail added successfully', {
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
      toast.error('Failed to add cocktail', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to add cocktail');
    }
  }
);

export const updateCocktail = createAsyncThunk(
  'cocktails/updateCocktail',
  async (
    { id, data }: { id: string; data: Partial<CocktailRecipe> },
    { rejectWithValue }
  ) => {
    try {
      const response = await cocktailService.updateCocktail(id, data);
      toast.success('Cocktail updated successfully', {
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
      toast.error('Failed to update cocktail', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to update cocktail');
    }
  }
);

export const deleteCocktail = createAsyncThunk(
  'cocktails/deleteCocktail',
  async (id: string, { rejectWithValue }) => {
    try {
      await cocktailService.deleteCocktail(id);
      toast.success('Cocktail deleted successfully', {
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
      toast.error('Failed to delete cocktail', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to delete cocktail');
    }
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
        state.error = null;
      })
      .addCase(fetchCocktails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cocktail
      .addCase(addCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCocktail.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails.push(action.payload);
        state.error = null;
      })
      .addCase(addCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cocktail
      .addCase(updateCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCocktail.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cocktails.findIndex(
          (cocktail) => cocktail._id === action.payload._id
        );
        if (index !== -1) {
          state.cocktails[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cocktail
      .addCase(deleteCocktail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCocktail.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = state.cocktails.filter(
          (cocktail) => cocktail._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCocktail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cocktailsSlice.reducer;
