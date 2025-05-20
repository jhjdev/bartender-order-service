import React, { useState, useEffect } from 'react';
import { useDrinks } from '../../hooks/useDrinks';
import { Drink, DrinkCategory } from '../../types/drink';
import { useAppDispatch } from '../../redux/hooks';
import {
  createDrink,
  updateDrink,
  deleteDrink,
} from '../../redux/slices/drinksSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { drinkService } from '../../services/drinkService';
import ReactDOM from 'react-dom';
import AddNewButton from '../../components/common/AddNewButton';
import '../../styles/forms.css';

const categories = [
  { value: null, label: 'All Drinks' },
  { value: DrinkCategory.DRAFT_BEER, label: 'Draft Beer' },
  { value: DrinkCategory.BOTTLED_BEER, label: 'Bottled Beer' },
  { value: DrinkCategory.WINE, label: 'Wine' },
  { value: DrinkCategory.SPIRIT, label: 'Spirits' },
  { value: DrinkCategory.NON_ALCOHOLIC, label: 'Non-Alcoholic' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DrinkForm = ({
  drink,
  onSubmit,
  onCancel,
}: {
  drink?: Drink;
  onSubmit: (drink: Partial<Drink>, imageFile?: File) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<Drink>>({
    name: '',
    category: DrinkCategory.DRAFT_BEER,
    price: 0,
    description: '',
    isAvailable: undefined,
    alcoholPercentage: 0,
    brewery: '',
    wineType: '',
    region: '',
    year: new Date().getFullYear(),
    distillery: '',
    ageStatement: '',
  });
  const [imageFile, setImageFile] = useState<File | undefined>();

  // Update formData when drink prop changes
  useEffect(() => {
    if (drink) {
      setFormData(drink);
    }
  }, [drink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isAvailable === undefined) {
      toast.error('Please select availability status');
      return;
    }
    onSubmit(formData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-header">
        <h2 className="form-title">{drink ? 'Edit Drink' : 'Add New Drink'}</h2>
        <p className="form-subtitle">
          {drink
            ? 'Update the details of your existing drink'
            : 'Fill in the details to add a new drink to your menu'}
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-group-label">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-group-label">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as DrinkCategory,
              })
            }
            className="form-input"
            required
          >
            {categories
              .filter((c) => c.value !== null)
              .map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-group-label">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-group-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input"
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Availability</h3>
        <div className="form-radio-group">
          <div className="flex items-center justify-center space-x-6">
            <label
              className={`form-radio-option ${
                formData.isAvailable === true
                  ? 'form-radio-option-selected'
                  : 'form-radio-option-unselected'
              }`}
            >
              <div className="absolute left-2">
                <input
                  type="radio"
                  name="availability"
                  checked={formData.isAvailable === true}
                  onChange={() =>
                    setFormData({ ...formData, isAvailable: true })
                  }
                  className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <span className="text-base font-medium text-gray-700">
                Available
              </span>
              {formData.isAvailable === true && (
                <svg
                  className="absolute right-2 h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </label>
            <label
              className={`form-radio-option ${
                formData.isAvailable === false
                  ? 'form-radio-option-selected'
                  : 'form-radio-option-unselected'
              }`}
            >
              <div className="absolute left-2">
                <input
                  type="radio"
                  name="availability"
                  checked={formData.isAvailable === false}
                  onChange={() =>
                    setFormData({ ...formData, isAvailable: false })
                  }
                  className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <span className="text-base font-medium text-gray-700">
                Unavailable
              </span>
              {formData.isAvailable === false && (
                <svg
                  className="absolute right-2 h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </label>
          </div>
          <p className="form-group-description">
            {drink
              ? 'Select the current availability status'
              : 'Choose whether this drink is currently available'}
          </p>
        </div>
      </div>

      {/* Category-specific fields */}
      {(formData.category === DrinkCategory.DRAFT_BEER ||
        formData.category === DrinkCategory.BOTTLED_BEER) && (
        <div className="form-section">
          <h3 className="form-section-title">Beer Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Alcohol Percentage</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.alcoholPercentage || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alcoholPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-group-label">Brewery</label>
              <input
                type="text"
                value={formData.brewery}
                onChange={(e) =>
                  setFormData({ ...formData, brewery: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {formData.category === DrinkCategory.WINE && (
        <div className="form-section">
          <h3 className="form-section-title">Wine Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Wine Type</label>
              <input
                type="text"
                value={formData.wineType}
                onChange={(e) =>
                  setFormData({ ...formData, wineType: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-group-label">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-group-label">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year || new Date().getFullYear()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {formData.category === DrinkCategory.SPIRIT && (
        <div className="form-section">
          <h3 className="form-section-title">Spirit Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-group-label">Distillery</label>
              <input
                type="text"
                value={formData.distillery}
                onChange={(e) =>
                  setFormData({ ...formData, distillery: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-group-label">Age Statement</label>
              <input
                type="text"
                value={formData.ageStatement}
                onChange={(e) =>
                  setFormData({ ...formData, ageStatement: e.target.value })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <h3 className="form-section-title">Image</h3>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0])}
            className="form-file-input"
          />
          <a
            href="https://www.pexels.com/search/drink/"
            target="_blank"
            rel="noopener noreferrer"
            className="form-link mt-2 inline-block"
          >
            Find images on Pexels
          </a>
        </div>
      </div>

      <div className="form-button-group">
        <button
          type="button"
          onClick={onCancel}
          className="form-button form-button-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="form-button form-button-primary">
          {drink ? 'Save Changes' : 'Add Drink'}
        </button>
      </div>
    </form>
  );
};

const DrinksPage = () => {
  const dispatch = useAppDispatch();
  const { drinks, loading, error, searchTerm, setSearchTerm } = useDrinks();
  const [showForm, setShowForm] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<DrinkCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [drinkToDelete, setDrinkToDelete] = useState<string | null>(null);

  // Filter drinks based on search term and category
  const filteredDrinks = drinks.filter((drink) => {
    const matchesSearch = drink.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === null || drink.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddDrink = async (
    drinkData: Partial<Drink>,
    imageFile?: File
  ) => {
    try {
      setIsSubmitting(true);

      // Create a new object with only the defined values
      const cleanedData: Partial<Drink> = {
        name: drinkData.name,
        price: drinkData.price,
        description: drinkData.description,
        isAvailable: drinkData.isAvailable,
        category: drinkData.category,
        alcoholPercentage: drinkData.alcoholPercentage,
        brewery: drinkData.brewery,
        wineType: drinkData.wineType,
        region: drinkData.region,
        year: drinkData.year,
        distillery: drinkData.distillery,
        ageStatement: drinkData.ageStatement,
        imageData: drinkData.imageData,
      };

      let createdOrUpdatedDrink;
      if (editingDrink) {
        createdOrUpdatedDrink = await dispatch(
          updateDrink({ id: editingDrink._id, drinkData: cleanedData })
        ).unwrap();
        toast.success('Drink updated successfully!');
      } else {
        createdOrUpdatedDrink = await dispatch(
          createDrink(cleanedData)
        ).unwrap();
        toast.success('Drink created successfully!');
      }
      if (imageFile && createdOrUpdatedDrink?._id) {
        await drinkService.uploadDrinkImage(
          createdOrUpdatedDrink._id,
          imageFile
        );
      }
      setShowForm(false);
      setEditingDrink(undefined);
    } catch (error) {
      console.error('Error saving drink:', error);
      toast.error('Failed to save drink. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDrink = (drink: Drink) => {
    setEditingDrink(drink);
    setShowForm(true);
  };

  const handleDeleteDrink = async (drinkId: string) => {
    setDrinkToDelete(drinkId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!drinkToDelete) return;

    try {
      setIsSubmitting(true);
      await dispatch(deleteDrink(drinkToDelete)).unwrap();
      toast.success('Drink deleted successfully!');
    } catch (error) {
      console.error('Error deleting drink:', error);
      toast.error('Failed to delete drink. Please try again.');
    } finally {
      setIsSubmitting(false);
      setDeleteModalOpen(false);
      setDrinkToDelete(null);
    }
  };

  const renderDialogs = () => {
    return ReactDOM.createPortal(
      <>
        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div
            className="absolute inset-0 z-[99999] flex items-center justify-center"
            style={{
              position: 'absolute',
              top: window.scrollY,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100vh',
            }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              }}
            />
            <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-lg w-[85%] max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Delete Drink</h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this drink? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setDrinkToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drink Form Modal */}
        {showForm && (
          <div
            className="absolute inset-0 z-[99999] flex items-center justify-center"
            style={{
              position: 'absolute',
              top: window.scrollY,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100vh',
            }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              }}
            />
            <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-lg w-[85%] max-h-[90vh] overflow-y-auto">
              <DrinkForm
                drink={editingDrink}
                onSubmit={handleAddDrink}
                onCancel={() => {
                  setShowForm(false);
                  setEditingDrink(undefined);
                }}
              />
            </div>
          </div>
        )}
      </>,
      document.body
    );
  };

  return (
    <div className="relative min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{ top: '20px' }}
        className="!z-[99999]"
      />

      {renderDialogs()}

      <div className="p-4 relative drinks-container">
        <h1 className="text-2xl font-bold mb-6">Drinks</h1>

        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full md:w-96 px-4 py-2 rounded-md border-2 border-black bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors duration-200"
            />
            <AddNewButton
              onClick={() => setShowForm(true)}
              label="Add New Drink"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label
                key={category.value || 'all'}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 border ${
                  selectedCategory === category.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value || ''}
                  checked={selectedCategory === category.value}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value ? (e.target.value as DrinkCategory) : null
                    )
                  }
                  className="sr-only"
                />
                <span className="flex items-center">
                  {category.label}
                  {selectedCategory === category.value && (
                    <svg
                      className="ml-2 h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : filteredDrinks.length === 0 ? (
          <p>No drinks found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDrinks.map((drink) => {
              const imageUrl = drink.imageData
                ? `${API_URL}${drink.imageData.url}`
                : undefined;

              return (
                <div
                  key={drink._id}
                  className="bg-white p-4 border rounded shadow flex flex-col"
                >
                  {drink.imageData ? (
                    <img
                      src={imageUrl}
                      alt={drink.name}
                      className="w-full h-48 object-cover rounded mb-4"
                      onError={(e) => {
                        console.error('Failed to load image for drink:', {
                          name: drink.name,
                          imageData: drink.imageData,
                          fullUrl: imageUrl,
                          error: e,
                        });
                        if (
                          !e.currentTarget.src.includes('data:image/svg+xml')
                        ) {
                          e.currentTarget.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2YjcyN2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{drink.name}</h2>
                    <p className="text-gray-800 font-bold mt-2">
                      ${drink.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {drink.description}
                    </p>

                    {/* Category-specific details */}
                    {drink.category === DrinkCategory.DRAFT_BEER ||
                    drink.category === DrinkCategory.BOTTLED_BEER ? (
                      <>
                        {drink.alcoholPercentage && (
                          <p className="text-sm text-gray-600 mt-1">
                            ABV: {drink.alcoholPercentage}%
                          </p>
                        )}
                        {drink.brewery && (
                          <p className="text-sm text-gray-600 mt-1">
                            Brewery: {drink.brewery}
                          </p>
                        )}
                      </>
                    ) : drink.category === DrinkCategory.WINE ? (
                      <>
                        {drink.wineType && (
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {drink.wineType}
                          </p>
                        )}
                        {drink.region && (
                          <p className="text-sm text-gray-600 mt-1">
                            Region: {drink.region}
                          </p>
                        )}
                        {drink.year && (
                          <p className="text-sm text-gray-600 mt-1">
                            Year: {drink.year}
                          </p>
                        )}
                      </>
                    ) : drink.category === DrinkCategory.SPIRIT ? (
                      <>
                        {drink.distillery && (
                          <p className="text-sm text-gray-600 mt-1">
                            Distillery: {drink.distillery}
                          </p>
                        )}
                        {drink.ageStatement && (
                          <p className="text-sm text-gray-600 mt-1">
                            Age: {drink.ageStatement}
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          drink.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {drink.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDrink(drink)}
                          disabled={isSubmitting}
                          className={`p-1 text-blue-600 hover:text-blue-800 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDrink(drink._id)}
                          disabled={isSubmitting}
                          className={`p-1 text-red-600 hover:text-red-800 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinksPage;
