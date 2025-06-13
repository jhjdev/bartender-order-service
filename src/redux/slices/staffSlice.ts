import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { staffService } from '../../services/staffService';
import { Staff } from '../../types/staff';
import { toast } from 'react-toastify';

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

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getAllStaff();
      return response;
    } catch (error) {
      toast.error('Failed to fetch staff members', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to fetch staff');
    }
  }
);

export const fetchCurrentStaff = createAsyncThunk(
  'staff/fetchCurrentStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getCurrentStaff();
      return response;
    } catch (error) {
      toast.error('Failed to fetch current staff', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to fetch current staff');
    }
  }
);

export const addStaff = createAsyncThunk(
  'staff/addStaff',
  async (staffData: Omit<Staff, 'id'>, { rejectWithValue }) => {
    try {
      const response = await staffService.createStaff(staffData);
      toast.success('Staff member added successfully', {
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
      toast.error('Failed to add staff member', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to add staff');
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async (
    { id, data }: { id: string; data: Partial<Staff> },
    { rejectWithValue }
  ) => {
    try {
      const response = await staffService.updateStaff(id, data);
      toast.success('Staff member updated successfully', {
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
      toast.error('Failed to update staff member', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return rejectWithValue('Failed to update staff');
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id: string, { rejectWithValue }) => {
    try {
      await staffService.deleteStaff(id);
      toast.success('Staff member deleted successfully', {
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
      toast.error('Failed to delete staff member', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
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
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
        state.error = null;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
        state.error = null;
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        state.error = null;
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = state.staff.filter(
          (staff) => staff.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
