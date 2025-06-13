import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tableService } from '../../services/tableService';
import { Table } from '../../types/table';
import { toast } from 'react-toastify';

interface TablesState {
  tables: Table[];
  loading: boolean;
  error: string | null;
}

const initialState: TablesState = {
  tables: [],
  loading: false,
  error: null,
};

export const fetchTables = createAsyncThunk(
  'tables/fetchTables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tableService.getAllTables();
      return response;
    } catch (error) {
      toast.error('Failed to fetch tables', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to fetch tables');
    }
  }
);

export const addTable = createAsyncThunk(
  'tables/addTable',
  async (tableData: Omit<Table, '_id'>, { rejectWithValue }) => {
    try {
      const response = await tableService.createTable(tableData);
      toast.success('Table added successfully', {
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
      toast.error('Failed to add table', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to add table');
    }
  }
);

export const updateTable = createAsyncThunk(
  'tables/updateTable',
  async (
    { id, data }: { id: string; data: Partial<Table> },
    { rejectWithValue }
  ) => {
    try {
      const response = await tableService.updateTable(id, data);
      toast.success('Table updated successfully', {
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
      toast.error('Failed to update table', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to update table');
    }
  }
);

export const deleteTable = createAsyncThunk(
  'tables/deleteTable',
  async (id: string, { rejectWithValue }) => {
    try {
      await tableService.deleteTable(id);
      toast.success('Table deleted successfully', {
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
      toast.error('Failed to delete table', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to delete table');
    }
  }
);

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
        state.error = null;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
        state.error = null;
      })
      .addCase(addTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex(
          (table: Table) => table._id === action.payload._id
        );
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = state.tables.filter(
          (table: Table) => table._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tablesSlice.reducer;
