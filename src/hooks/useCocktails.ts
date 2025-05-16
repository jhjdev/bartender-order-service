import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCocktails } from '../redux/slices/cocktailsSlice';
import { CocktailRecipe } from '../types/drink';

export const useCocktails = () => {
  const dispatch = useAppDispatch();
  const { cocktails, loading, error } = useAppSelector(
    (state) => state.cocktails
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Fetching cocktails...');
    dispatch(fetchCocktails());
  }, [dispatch]);

  useEffect(() => {
    console.log('Cocktails state:', { cocktails, loading, error });
  }, [cocktails, loading, error]);

  const filteredCocktails = cocktails.filter((cocktail: CocktailRecipe) =>
    cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    cocktails: filteredCocktails,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
};
