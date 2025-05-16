import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchDrinks } from '../redux/slices/drinksSlice';
import { Drink, DrinkCategory } from '../types/drink';

export const useDrinks = () => {
  const dispatch = useAppDispatch();
  const { drinks, loading, error } = useAppSelector((state) => state.drinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<DrinkCategory | null>(null);

  useEffect(() => {
    console.log('Fetching drinks...');
    dispatch(fetchDrinks());
  }, [dispatch]);

  useEffect(() => {
    console.log('Drinks state:', { drinks, loading, error });
  }, [drinks, loading, error]);

  const filteredDrinks = drinks.filter((drink: Drink) => {
    const matchesSearch = drink.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || drink.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    drinks: filteredDrinks,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  };
};
