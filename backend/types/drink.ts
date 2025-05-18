import { ObjectId } from 'mongodb';

export enum DrinkCategory {
  BEER = 'BEER',
  WINE = 'WINE',
  SPIRIT = 'SPIRIT',
  COCKTAIL = 'COCKTAIL',
  NON_ALCOHOLIC = 'NON_ALCOHOLIC',
}

export interface ImageData {
  _id: string;
  url: string;
  name: string;
}

// Client-side interface for creating and updating
export interface Drink {
  name: string;
  category: DrinkCategory;
  price: number;
  description?: string;
  isAvailable: boolean;
  imageData?: ImageData;
}

export interface CocktailRecipe extends Drink {
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  isInMenu: boolean;
  glassType?: string;
  garnish?: string;
  preparationTime?: number;
}

// MongoDB document interfaces
export interface DrinkDocument extends Omit<Drink, '_id'> {
  _id: ObjectId;
}

export interface CocktailDocument extends Omit<CocktailRecipe, '_id'> {
  _id: ObjectId;
}

// API response interfaces
export interface DrinkApiResponse extends Omit<Drink, '_id'> {
  _id: string;
}

export interface CocktailApiResponse extends Omit<CocktailRecipe, '_id'> {
  _id: string;
}

// Input interfaces for create operations (without _id)
export type DrinkInput = Omit<Drink, '_id'>;
export type CocktailInput = Omit<CocktailRecipe, '_id'>;
