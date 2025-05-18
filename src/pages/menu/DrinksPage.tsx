import React, { useState } from 'react';
import { useDrinks } from '../../hooks/useDrinks';
import { DrinkCategory } from '../../types/drink';

const categories = [
  { value: null, label: 'All Drinks' },
  { value: DrinkCategory.DRAFT_BEER, label: 'Draft Beer' },
  { value: DrinkCategory.BOTTLED_BEER, label: 'Bottled Beer' },
  { value: DrinkCategory.WINE, label: 'Wine' },
  { value: DrinkCategory.SPIRIT, label: 'Spirits' },
  { value: DrinkCategory.NON_ALCOHOLIC, label: 'Non-Alcoholic' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Base64 encoded 1x1 transparent pixel
const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const DrinksPage = () => {
  const {
    drinks,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useDrinks();

  // Track failed image loads to prevent infinite loops
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Debug information
  console.log('Rendering DrinksPage with:', {
    drinksCount: drinks.length,
    selectedCategory,
    searchTerm,
  });

  return (
    <div className="p-2 md:ml-0">
      <h1 className="text-2xl font-bold mb-4">Drinks</h1>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search drinks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border p-2 rounded"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : drinks.length === 0 ? (
        <p>No drinks found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {drinks.map((drink) => {
            const imageUrl = drink.imageData
              ? `${API_URL}${drink.imageData.url}`
              : undefined;
            const hasFailed = imageUrl ? failedImages.has(imageUrl) : true;

            return (
              <div
                key={drink._id}
                className="bg-white p-4 border rounded shadow"
              >
                <div className="relative h-48">
                  {drink.imageData && !hasFailed && (
                    <img
                      src={imageUrl}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load image for drink:', {
                          name: drink.name,
                          imageData: drink.imageData,
                          fullUrl: imageUrl,
                          error: e,
                        });
                        if (imageUrl) {
                          setFailedImages((prev) =>
                            new Set(prev).add(imageUrl)
                          );
                        }
                        e.currentTarget.src = TRANSPARENT_PIXEL;
                      }}
                      onLoad={() => {
                        console.log('Successfully loaded image for drink:', {
                          name: drink.name,
                          imageData: drink.imageData,
                          fullUrl: imageUrl,
                        });
                      }}
                    />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{drink.name}</h2>
                <p className="text-gray-800 font-bold mb-2">
                  ${drink.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {drink.description}
                </p>

                {/* Additional drink details */}
                {drink.alcoholPercentage && (
                  <p className="text-sm text-gray-600">
                    Alcohol: {drink.alcoholPercentage}%
                  </p>
                )}
                {drink.brewery && (
                  <p className="text-sm text-gray-600">
                    Brewery: {drink.brewery}
                  </p>
                )}
                {drink.wineType && (
                  <p className="text-sm text-gray-600">
                    Type: {drink.wineType}
                  </p>
                )}
                {drink.region && (
                  <p className="text-sm text-gray-600">
                    Region: {drink.region}
                  </p>
                )}
                {drink.year && (
                  <p className="text-sm text-gray-600">Year: {drink.year}</p>
                )}
                {drink.distillery && (
                  <p className="text-sm text-gray-600">
                    Distillery: {drink.distillery}
                  </p>
                )}
                {drink.ageStatement && (
                  <p className="text-sm text-gray-600">
                    Age: {drink.ageStatement}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DrinksPage;
