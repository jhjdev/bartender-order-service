import { BaseDocument } from './mongodb';
import { ObjectId } from 'mongodb';

export enum DrinkCategory {
  BEER = 'BEER',
  WINE = 'WINE',
  SPIRIT = 'SPIRIT',
  COCKTAIL = 'COCKTAIL',
  NON_ALCOHOLIC = 'NON_ALCOHOLIC',
}

export interface ImageData {
  url: string;
  source: 'upload' | 'unsplash';
  unsplashId?: string;
}

// Client-side interface for creating and updating
export interface Drink {
  name: string;
  category: DrinkCategory;
  price: number;
  description?: string;
  isAvailable: boolean;
  imageUrl?: string;
  imageData?: ImageData;
}

export interface CocktailRecipe extends Drink {
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  isInMenu: boolean;
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

export interface DrinkApiResponse extends Omit<Drink, '_id'> {
  _id: string;
}

export interface CocktailRecipe {
  _id?: string;
  name: string;
  category: DrinkCategory.COCKTAIL;
  price: number;
  description: string;
  isAvailable: boolean;
  imageData: ImageData;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  glassType: string;
  garnish?: string;
  preparationTime: number;
  isInMenu: boolean;
}

// MongoDB specific collection interfaces
export interface DrinkDocument extends Omit<Drink, '_id'>, BaseDocument {}

export interface CocktailDocument
  extends Omit<CocktailRecipe, '_id'>,
    BaseDocument {}

// Input interfaces for create operations (without _id)
export type DrinkInput = Omit<Drink, '_id'>;
export type CocktailInput = Omit<CocktailRecipe, '_id'>;
