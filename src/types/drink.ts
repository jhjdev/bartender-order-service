export enum DrinkCategory {
  DRAFT_BEER = 'DRAFT_BEER',
  BOTTLED_BEER = 'BOTTLED_BEER',
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

export interface Drink {
  _id: string;
  name: string;
  category: DrinkCategory;
  price: number;
  description?: string;
  available: boolean;
  imageData?: ImageData;
  alcoholPercentage?: number;
  brewery?: string;
  wineType?: string;
  region?: string;
  year?: number;
  distillery?: string;
  ageStatement?: string;
}

export interface CocktailRecipe extends Drink {
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  isInMenu: boolean;
  glassType?: string;
  garnish?: string;
  preparationTime?: number;
}
