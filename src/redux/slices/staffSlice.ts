// Staff slice for managing staff members
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { staffService } from '../../services/staffService';

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

export interface StaffMember {
  _id?: string;
  id?: string;
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
  position: string;
  isActive: boolean;
}

interface StaffState {
  staff: StaffMember[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchStaff = createAsyncThunk('staff/fetchStaff', async () => {
  const response = await staffService.getAllStaff();
  return response;
});

export const addStaff = createAsyncThunk(
  'staff/addStaff',
  async (staff: Omit<StaffMember, 'id'>) => {
    const response = await staffService.createStaff(staff);
    return response;
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async (staff: StaffMember) => {
    console.log('Updating staff in thunk:', staff); // Debug log
    const response = await staffService.updateStaff(staff);
    console.log('Update response:', response); // Debug log
    return response;
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id: string) => {
    await staffService.deleteStaff(id);
    return id;
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch staff
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
        state.error = action.error.message || 'Failed to fetch staff';
      })
      // Add staff
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload);
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add staff';
      })
      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staff.findIndex(
          (member) => member.id === action.payload.id
        );
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update staff';
      })
      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = state.staff.filter(
          (member) => member.id !== action.payload
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete staff';
      });
  },
});

export default staffSlice.reducer;
