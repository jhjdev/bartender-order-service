import axios from 'axios';
import { StaffMember } from '../redux/slices/staffSlice';

const API_URL = '/api/staff';

export const staffService = {
  // Get all staff members
  getAllStaff: async (): Promise<StaffMember[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Create a new staff member
  createStaff: async (staff: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
    const response = await axios.post(API_URL, staff);
    return response.data;
  },

  // Update a staff member
  updateStaff: async (staff: StaffMember): Promise<StaffMember> => {
    const { _id, ...staffData } = staff;
    console.log('Sending update request:', { _id, staffData }); // Debug log
    const response = await axios.put(`${API_URL}/${_id}`, staffData);
    console.log('Update response:', response.data); // Debug log
    return response.data;
  },

  // Delete a staff member
  deleteStaff: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
