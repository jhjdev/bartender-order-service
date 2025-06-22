import axios from '../config/axios';
import { CocktailRecipe } from '../types/drink';

export const cocktailService = {
  async getAllCocktails() {
    const response = await axios.get<CocktailRecipe[]>('/cocktails');
    return response.data;
  },

  async createCocktail(cocktailData: Partial<CocktailRecipe>) {
    const response = await axios.post('/cocktails', cocktailData);
    return response.data;
  },

  async updateCocktail(id: string, cocktailData: Partial<CocktailRecipe>) {
    const response = await axios.put(`/cocktails/${id}`, cocktailData);
    return response.data;
  },

  async deleteCocktail(id: string) {
    const response = await axios.delete(`/cocktails/${id}`);
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
  async moveImageToUploads(
    tempId: string,
    cocktailId: string,
    cocktailName: string
  ) {
    const response = await axios.post('/images/move-to-uploads', {
      tempId,
      drinkId: cocktailId,
      drinkName: cocktailName,
      type: 'cocktail',
    });
    return response.data;
  },
};
