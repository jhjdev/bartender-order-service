import axios from 'axios';
import { Drink } from '../types/drink';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const drinkService = {
  async getAllDrinks() {
    const response = await axios.get<Drink[]>(`${API_URL}/api/drinks`);
    return response.data;
  },

  async createDrink(drinkData: Partial<Drink>) {
    const response = await axios.post(`${API_URL}/api/drinks`, drinkData);
    return response.data;
  },

  async updateDrink(id: string, drinkData: Partial<Drink>) {
    const response = await axios.put(`${API_URL}/api/drinks/${id}`, drinkData);
    return response.data;
  },

  async deleteDrink(id: string) {
    const response = await axios.delete(`${API_URL}/api/drinks/${id}`);
    return response.data;
  },

  async uploadDrinkImage(id: string, imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(
      `${API_URL}/api/drinks/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
