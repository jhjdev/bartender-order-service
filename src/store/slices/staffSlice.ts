import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    countryCode: string;
    number: string;
  };
  emergencyContact: EmergencyContact;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
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

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<StaffMember[]>) => {
      state.staff = action.payload;
    },
    addStaff: (state, action: PayloadAction<StaffMember>) => {
      state.staff.push(action.payload);
    },
    updateStaff: (state, action: PayloadAction<StaffMember>) => {
      const index = state.staff.findIndex(
        (member) => member.id === action.payload.id
      );
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
    },
    deleteStaff: (state, action: PayloadAction<string>) => {
      state.staff = state.staff.filter(
        (member) => member.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  setLoading,
  setError,
} = staffSlice.actions;

export default staffSlice.reducer;
