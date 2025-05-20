import axios from 'axios';
import { CocktailRecipe } from '../types/drink';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const cocktailService = {
  async getAllCocktails() {
    const response = await axios.get<CocktailRecipe[]>(
      `${API_URL}/api/cocktails`
    );
    return response.data;
  },

  async createCocktail(cocktailData: Partial<CocktailRecipe>) {
    const response = await axios.post(`${API_URL}/api/cocktails`, cocktailData);
    return response.data;
  },

  async updateCocktail(id: string, cocktailData: Partial<CocktailRecipe>) {
    const response = await axios.put(
      `${API_URL}/api/cocktails/${id}`,
      cocktailData
    );
    return response.data;
  },

  async deleteCocktail(id: string) {
    const response = await axios.delete(`${API_URL}/api/cocktails/${id}`);
    return response.data;
  },

  async uploadCocktailImage(id: string, imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(
      `${API_URL}/api/cocktails/${id}/image`,
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
