import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCocktails } from '../redux/slices/cocktailsSlice';
import { CocktailRecipe } from '../types/drink';
import { toast } from 'react-toastify';

export const useCocktails = () => {
  const dispatch = useAppDispatch();
  const {
    cocktails = [],
    loading,
    error,
  } = useAppSelector((state) => state.cocktails);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCocktails = async () => {
      try {
        await dispatch(fetchCocktails()).unwrap();
      } catch (error) {
        console.error('Failed to fetch cocktails:', error);
        toast.error('Failed to load cocktails', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      }
    };
    loadCocktails();
  }, [dispatch]);

  const filteredCocktails: CocktailRecipe[] = Array.isArray(cocktails)
    ? cocktails.filter((cocktail) =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return {
    cocktails: filteredCocktails,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: () => dispatch(fetchCocktails()),
  };
};
