import { DrinkCategory } from '../types/drink';
import { BaseDocument } from '../types/mongodb';

export interface ICocktailRecipe {
  name: string;
  category: DrinkCategory;
  price: number;
  description?: string;
  isAvailable: boolean;
  imageData?: {
    _id: string;
    url: string;
    name: string;
  };
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  isInMenu: boolean;
  glassType?: string;
  garnish?: string;
  preparationTime?: number;
}

export type CocktailRecipeDocument = ICocktailRecipe & BaseDocument;
