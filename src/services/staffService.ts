import axios from '../config/axios';
import { Staff } from '../types/staff';

const API_URL = '/staff';

export const staffService = {
  // Get all staff members
  async getAllStaff(): Promise<Staff[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get a staff member by ID
  async getStaffById(id: string): Promise<Staff> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Get the current staff member
  async getCurrentStaff(): Promise<Staff> {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },

  // Create a new staff member
  async createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
    const response = await axios.post(API_URL, staff);
    return response.data;
  },

  // Update a staff member
  async updateStaff(id: string, staff: Partial<Staff>): Promise<Staff> {
    const response = await axios.put(`${API_URL}/${id}`, staff);
    return response.data;
  },

  // Delete a staff member
  async deleteStaff(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
