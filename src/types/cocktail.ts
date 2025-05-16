import { Drink } from './drink';

export interface Cocktail extends Drink {
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  glassType: string;
  garnish: string;
  preparationTime: number;
  isInMenu: boolean;
  createdAt?: string;
  updatedAt?: string;
}
