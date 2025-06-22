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

  // Upload image to temp-uploads
  async uploadTempImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Move temp image to uploads and sync to database
  async moveImageToUploads(tempId: string, drinkId: string, drinkName: string) {
    const response = await axios.post('/images/move-to-uploads', {
      tempId,
      drinkId,
      drinkName,
      type: 'drink',
    });
    return response.data;
  },
};
