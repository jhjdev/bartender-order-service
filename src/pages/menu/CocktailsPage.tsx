import React, { useState, useEffect } from 'react';
import { useCocktails } from '../../hooks/useCocktails';
import { CocktailRecipe } from '../../types/drink';
import { useAppDispatch } from '../../redux/hooks';
import {
  createCocktail,
  updateCocktail,
  deleteCocktail,
} from '../../redux/slices/cocktailsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cocktailService } from '../../services/cocktailService';
import ReactDOM from 'react-dom';
import AddNewButton from '../../components/common/AddNewButton';
import '../../styles/forms.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CocktailForm = ({
  cocktail,
  onSubmit,
  onCancel,
}: {
  cocktail?: CocktailRecipe;
  onSubmit: (cocktail: Partial<CocktailRecipe>, imageFile?: File) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<CocktailRecipe>>({
    name: '',
    price: 0,
    description: '',
    isAvailable: undefined,
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    glassType: '',
    garnish: '',
    preparationTime: 5,
    isInMenu: true,
  });
  const [imageFile, setImageFile] = useState<File | undefined>();

  // Update formData when cocktail prop changes
  useEffect(() => {
    if (cocktail) {
      setFormData(cocktail);
    }
  }, [cocktail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isAvailable === undefined) {
      toast.error('Please select availability status');
      return;
    }
    onSubmit(formData, imageFile);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...(formData.ingredients || []),
        { name: '', amount: '', unit: '' },
      ],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (
    index: number,
    field: 'name' | 'amount' | 'unit',
    value: string
  ) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...(formData.instructions || []), ''],
    });
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions?.filter((_, i) => i !== index),
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...(formData.instructions || [])];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-header">
        <h2 className="form-title">
          {cocktail ? 'Edit Cocktail' : 'Add New Cocktail'}
        </h2>
        <p className="form-subtitle">
          {cocktail
            ? 'Update the details of your existing cocktail'
            : 'Fill in the details to add a new cocktail to your menu'}
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
          <label className="form-group-label">Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
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
            {cocktail
              ? 'Select the current availability status'
              : 'Choose whether this cocktail is currently available'}
          </p>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Cocktail Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-group-label">Glass Type</label>
            <input
              type="text"
              value={formData.glassType}
              onChange={(e) =>
                setFormData({ ...formData, glassType: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-group-label">Garnishes</label>
            <input
              type="text"
              value={formData.garnish}
              onChange={(e) =>
                setFormData({ ...formData, garnish: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-group-label">
              Preparation Time (minutes)
            </label>
            <input
              type="number"
              value={formData.preparationTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preparationTime: parseInt(e.target.value),
                })
              }
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="flex justify-between items-center mb-2">
          <h3 className="form-section-title">Ingredients</h3>
          <button type="button" onClick={addIngredient} className="form-link">
            + Add Ingredient
          </button>
        </div>
        <div className="form-list">
          {formData.ingredients?.map((ingredient, index) => (
            <div key={index} className="form-list-item">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, 'name', e.target.value)
                }
                className="form-input flex-1"
              />
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) =>
                  updateIngredient(index, 'amount', e.target.value)
                }
                className="form-input w-24"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, 'unit', e.target.value)
                }
                className="form-input w-24"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="flex justify-between items-center mb-2">
          <h3 className="form-section-title">Instructions</h3>
          <button type="button" onClick={addInstruction} className="form-link">
            + Add Step
          </button>
        </div>
        <div className="form-list">
          {formData.instructions?.map((instruction, index) => (
            <div key={index} className="form-list-item">
              <input
                type="text"
                placeholder={`Step ${index + 1}`}
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

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
            href="https://www.pexels.com/search/cocktail/"
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
          {cocktail ? 'Save Changes' : 'Add Cocktail'}
        </button>
      </div>
    </form>
  );
};

const CocktailsPage = () => {
  const dispatch = useAppDispatch();
  const { cocktails, loading, error, searchTerm, setSearchTerm } =
    useCocktails();
  const [showForm, setShowForm] = useState(false);
  const [editingCocktail, setEditingCocktail] = useState<
    CocktailRecipe | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);

  const handleAddCocktail = async (
    cocktailData: Partial<CocktailRecipe>,
    imageFile?: File
  ) => {
    try {
      setIsSubmitting(true);

      // Create a new object with only the defined values
      const cleanedData: Partial<CocktailRecipe> = {
        name: cocktailData.name,
        price: cocktailData.price,
        description: cocktailData.description,
        isAvailable: cocktailData.isAvailable,
        ingredients: cocktailData.ingredients,
        instructions: cocktailData.instructions,
        glassType: cocktailData.glassType,
        garnish: cocktailData.garnish,
        preparationTime: cocktailData.preparationTime,
        isInMenu: cocktailData.isInMenu,
        category: cocktailData.category,
        imageData: cocktailData.imageData,
      };

      let createdOrUpdatedCocktail;
      if (editingCocktail) {
        createdOrUpdatedCocktail = await dispatch(
          updateCocktail({ id: editingCocktail._id, cocktailData: cleanedData })
        ).unwrap();
        toast.success('Cocktail updated successfully!');
      } else {
        createdOrUpdatedCocktail = await dispatch(
          createCocktail(cleanedData)
        ).unwrap();
        toast.success('Cocktail created successfully!');
      }
      if (imageFile && createdOrUpdatedCocktail?._id) {
        await cocktailService.uploadCocktailImage(
          createdOrUpdatedCocktail._id,
          imageFile
        );
      }
      setShowForm(false);
      setEditingCocktail(undefined);
    } catch (error) {
      console.error('Error saving cocktail:', error);
      toast.error('Failed to save cocktail. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCocktail = (cocktail: CocktailRecipe) => {
    setEditingCocktail(cocktail);
    setShowForm(true);
  };

  const handleDeleteCocktail = async (cocktailId: string) => {
    setCocktailToDelete(cocktailId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cocktailToDelete) return;

    try {
      setIsSubmitting(true);
      await dispatch(deleteCocktail(cocktailToDelete)).unwrap();
      toast.success('Cocktail deleted successfully!');
    } catch (error) {
      console.error('Error deleting cocktail:', error);
      toast.error('Failed to delete cocktail. Please try again.');
    } finally {
      setIsSubmitting(false);
      setDeleteModalOpen(false);
      setCocktailToDelete(null);
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
              <h2 className="text-2xl font-bold mb-4">Delete Cocktail</h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this cocktail? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setCocktailToDelete(null);
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

        {/* Cocktail Form Modal */}
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
              <h2 className="text-2xl font-bold mb-4">
                {editingCocktail ? 'Edit Cocktail' : 'Add New Cocktail'}
              </h2>
              <CocktailForm
                cocktail={editingCocktail}
                onSubmit={handleAddCocktail}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCocktail(undefined);
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

      <div className="p-4 relative cocktails-container">
        <h1 className="text-2xl font-bold mb-6">Cocktails</h1>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search cocktails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full md:w-96 px-4 py-2 rounded-md border-2 border-black bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors duration-200"
            />
            <AddNewButton
              onClick={() => setShowForm(true)}
              label="Add New Cocktail"
              disabled={isSubmitting}
            />
          </div>
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
                className="bg-white p-4 border rounded shadow flex flex-col"
              >
                {cocktail.imageData ? (
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
                  <h2 className="text-xl font-semibold">{cocktail.name}</h2>
                  <p className="text-gray-800 font-bold mt-2">
                    ${cocktail.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {cocktail.description}
                  </p>

                  {/* Additional cocktail details */}
                  {cocktail.glassType && (
                    <p className="text-sm text-gray-600 mt-1">
                      Glass: {cocktail.glassType}
                    </p>
                  )}
                  {cocktail.garnish && (
                    <p className="text-sm text-gray-600 mt-1">
                      Garnish: {cocktail.garnish}
                    </p>
                  )}
                  {cocktail.preparationTime && (
                    <p className="text-sm text-gray-600 mt-1">
                      Prep time: {cocktail.preparationTime} min
                    </p>
                  )}

                  {/* Ingredients */}
                  {cocktail.ingredients && cocktail.ingredients.length > 0 && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Ingredients:
                      </h3>
                      <ul className="mt-1 text-sm text-gray-600">
                        {cocktail.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            {ingredient.amount} {ingredient.unit}{' '}
                            {ingredient.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructions */}
                  {cocktail.instructions &&
                    cocktail.instructions.length > 0 && (
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-700">
                          Instructions:
                        </h3>
                        <ol className="mt-1 text-sm text-gray-600 list-decimal list-inside">
                          {cocktail.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        cocktail.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cocktail.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCocktail(cocktail)}
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
                        onClick={() => handleDeleteCocktail(cocktail._id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CocktailsPage;
