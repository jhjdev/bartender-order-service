import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCocktails } from '../redux/slices/cocktailsSlice';

export const useCocktails = () => {
  const dispatch = useAppDispatch();
  const { cocktails, loading, error } = useAppSelector(
    (state) => state.cocktails
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCocktails());
  }, [dispatch]);

  const filteredCocktails = cocktails.filter((cocktail) =>
    cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    cocktails: filteredCocktails,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: () => dispatch(fetchCocktails()),
  };
};
