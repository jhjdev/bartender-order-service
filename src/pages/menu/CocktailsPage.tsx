import React from 'react';
import { useCocktails } from '../../hooks/useCocktails';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CocktailsPage = () => {
  const { cocktails, loading, error, searchTerm, setSearchTerm } =
    useCocktails();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cocktails</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cocktails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 border p-2 rounded"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail._id}
              className="bg-white p-4 border rounded shadow"
            >
              {cocktail.imageData && (
                <img
                  src={`${API_URL}${cocktail.imageData.url}`}
                  alt={cocktail.name}
                  className="w-full h-48 object-cover rounded mb-4"
                  onError={(e) => {
                    console.error('Failed to load image for cocktail:', {
                      name: cocktail.name,
                      imageData: cocktail.imageData,
                      fullUrl: cocktail.imageData
                        ? `${API_URL}${cocktail.imageData.url}`
                        : null,
                      error: e,
                    });
                    if (!e.currentTarget.src.includes('data:image/svg+xml')) {
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2YjcyN2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                  onLoad={() => {
                    console.log('Successfully loaded image for cocktail:', {
                      name: cocktail.name,
                      imageData: cocktail.imageData,
                      fullUrl: cocktail.imageData
                        ? `${API_URL}${cocktail.imageData.url}`
                        : null,
                    });
                  }}
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{cocktail.name}</h2>
              <p className="text-gray-800 font-bold mb-2">
                ${cocktail.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {cocktail.description}
              </p>
              {/* Additional cocktail details */}
              {cocktail.glassType && (
                <p className="text-sm text-gray-600">
                  Glass: {cocktail.glassType}
                </p>
              )}
              {cocktail.garnish && (
                <p className="text-sm text-gray-600">
                  Garnish: {cocktail.garnish}
                </p>
              )}
              {cocktail.preparationTime && (
                <p className="text-sm text-gray-600">
                  Prep time: {cocktail.preparationTime} min
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CocktailsPage;
