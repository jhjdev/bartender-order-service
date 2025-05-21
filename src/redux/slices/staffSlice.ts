import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios';
import { Staff } from '../../types/staff';
import { AxiosError } from 'axios';

export interface Phone {
  countryCode: string;
  number: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: Phone;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type UserRole = 'ADMIN' | 'STAFF';

export interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  emergencyContact: EmergencyContact;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dateOfBirth: string;
  address: Address;
  startDate: string;
  endDate?: string;
  position: string;
  isActive: boolean;
  role: UserRole;
  profilePicture?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffState {
  staff: Staff[];
  currentStaff: Staff | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: [],
  currentStaff: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Staff[]>('/staff');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch staff'
        );
      }
      return rejectWithValue('Failed to fetch staff');
    }
  }
);

export const fetchCurrentStaff = createAsyncThunk(
  'staff/fetchCurrentStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Staff>('/staff/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch current staff'
        );
      }
      return rejectWithValue('Failed to fetch current staff');
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (staffData: Omit<Staff, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Staff>('/staff', staffData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to create staff'
        );
      }
      return rejectWithValue('Failed to create staff');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async (
    { id, staffData }: { id: string; staffData: Partial<Staff> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Staff>(`/staff/${id}`, staffData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to update staff'
        );
      }
      return rejectWithValue('Failed to update staff');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/staff/${id}`);
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to delete staff'
        );
      }
      return rejectWithValue('Failed to delete staff');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch current staff
      .addCase(fetchCurrentStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload;
      })
      .addCase(fetchCurrentStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create staff
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staff.findIndex(
          (staff) => staff.id === action.payload.id
        );
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
        if (state.currentStaff?.id === action.payload.id) {
          state.currentStaff = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = state.staff.filter(
          (staff) => staff.id !== action.payload
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
