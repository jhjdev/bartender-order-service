import axios from '../config/axios';
import { Drink } from '../types/drink';

export const drinkService = {
  async getAllDrinks() {
    const response = await axios.get<Drink[]>('/drinks');
    return response.data;
  },

  async createDrink(drinkData: Partial<Drink>) {
    const response = await axios.post('/drinks', drinkData);
    return response.data;
  },

  async updateDrink(id: string, drinkData: Partial<Drink>) {
    const response = await axios.put(`/drinks/${id}`, drinkData);
    return response.data;
  },

  async deleteDrink(id: string) {
    const response = await axios.delete(`/drinks/${id}`);
    return response.data;
  },

  async uploadDrinkImage(id: string, imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`/drinks/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
