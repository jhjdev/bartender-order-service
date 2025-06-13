import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useCocktails } from '../../hooks/useCocktails';
import { CocktailRecipe } from '../../types/drink';
import { useAppDispatch } from '../../redux/hooks';
import {
  addCocktail,
  updateCocktail,
  deleteCocktail,
} from '../../redux/slices/cocktailsSlice';
import { toast } from 'react-toastify';
import { cocktailService } from '../../services/cocktailService';
import ReactDOM from 'react-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { useTranslation } from 'react-i18next';
import '../../styles/forms.css';

interface CocktailFormProps {
  cocktail?: CocktailRecipe;
  onSubmit: (cocktail: Partial<CocktailRecipe>, imageFile?: File) => void;
  onCancel: () => void;
}

const CocktailForm: FC<CocktailFormProps> = ({
  cocktail,
  onSubmit,
  onCancel,
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
  const { t } = useTranslation();

  // Update formData when cocktail prop changes
  useEffect(() => {
    if (cocktail) {
      setFormData(cocktail);
    }
  }, [cocktail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isAvailable === undefined) {
      toast.error(t('cocktails.form.errors.availabilityRequired'));
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
          {cocktail
            ? t('cocktails.form.editTitle')
            : t('cocktails.form.addTitle')}
        </h2>
        <p className="form-subtitle">
          {cocktail
            ? t('cocktails.form.editSubtitle')
            : t('cocktails.form.addSubtitle')}
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cocktail-name" className="form-group-label">
            {t('cocktails.form.name')}
          </label>
          <input
            id="cocktail-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
            placeholder={t('cocktails.form.namePlaceholder')}
            aria-label={t('cocktails.form.name')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cocktail-price" className="form-group-label">
            {t('cocktails.form.price')}
          </label>
          <input
            id="cocktail-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="form-input"
            required
            placeholder={t('cocktails.form.pricePlaceholder')}
            aria-label={t('cocktails.form.price')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cocktail-description" className="form-group-label">
            {t('cocktails.form.description')}
          </label>
          <textarea
            id="cocktail-description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input"
            rows={3}
            placeholder={t('cocktails.form.descriptionPlaceholder')}
            aria-label={t('cocktails.form.description')}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">
          {t('cocktails.form.availability')}
        </h3>
        <div className="form-radio-group">
          <div className="flex items-center justify-center space-x-6">
            <label
              htmlFor="availability-available"
              className={`form-radio-option ${
                formData.isAvailable === true
                  ? 'form-radio-option-selected'
                  : 'form-radio-option-unselected'
              }`}
            >
              <div className="absolute left-2">
                <input
                  id="availability-available"
                  type="radio"
                  name="availability"
                  checked={formData.isAvailable === true}
                  onChange={() =>
                    setFormData({ ...formData, isAvailable: true })
                  }
                  className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label={t('cocktails.form.setAvailable')}
                />
              </div>
              <span className="text-base font-medium text-gray-700">
                {t('cocktails.form.available')}
              </span>
              {formData.isAvailable === true && (
                <div className="absolute right-2">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>

            <label
              htmlFor="availability-unavailable"
              className={`form-radio-option ${
                formData.isAvailable === false
                  ? 'form-radio-option-selected'
                  : 'form-radio-option-unselected'
              }`}
            >
              <div className="absolute left-2">
                <input
                  id="availability-unavailable"
                  type="radio"
                  name="availability"
                  checked={formData.isAvailable === false}
                  onChange={() =>
                    setFormData({ ...formData, isAvailable: false })
                  }
                  className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label={t('cocktails.form.setUnavailable')}
                />
              </div>
              <span className="text-base font-medium text-gray-700">
                {t('cocktails.form.unavailable')}
              </span>
              {formData.isAvailable === false && (
                <div className="absolute right-2">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">
          {t('cocktails.form.ingredients')}
        </h3>
        <div className="space-y-4">
          {formData.ingredients?.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, 'name', e.target.value)
                }
                className="form-input flex-1"
                placeholder={t('cocktails.form.ingredientNamePlaceholder')}
                aria-label={t('cocktails.form.ingredientName')}
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) =>
                  updateIngredient(index, 'amount', e.target.value)
                }
                className="form-input w-24"
                placeholder={t('cocktails.form.amountPlaceholder')}
                aria-label={t('cocktails.form.amount')}
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, 'unit', e.target.value)
                }
                className="form-input w-24"
                placeholder={t('cocktails.form.unitPlaceholder')}
                aria-label={t('cocktails.form.unit')}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-600 hover:text-red-800"
                aria-label={t('cocktails.form.removeIngredient')}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-blue-600 hover:text-blue-800 flex items-center"
            aria-label={t('cocktails.form.addIngredient')}
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {t('cocktails.form.addIngredient')}
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">
          {t('cocktails.form.instructions')}
        </h3>
        <div className="space-y-4">
          {formData.instructions?.map((instruction, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="form-input flex-1"
                placeholder={t('cocktails.form.instructionPlaceholder', {
                  number: index + 1,
                })}
                aria-label={t('cocktails.form.instruction', {
                  number: index + 1,
                })}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="text-red-600 hover:text-red-800"
                aria-label={t('cocktails.form.removeInstruction')}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="text-blue-600 hover:text-blue-800 flex items-center"
            aria-label={t('cocktails.form.addInstruction')}
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {t('cocktails.form.addInstruction')}
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('cocktails.form.details')}</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cocktail-glass" className="form-group-label">
              {t('cocktails.form.glassType')}
            </label>
            <input
              id="cocktail-glass"
              type="text"
              value={formData.glassType}
              onChange={(e) =>
                setFormData({ ...formData, glassType: e.target.value })
              }
              className="form-input"
              placeholder={t('cocktails.form.glassTypePlaceholder')}
              aria-label={t('cocktails.form.glassType')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cocktail-garnish" className="form-group-label">
              {t('cocktails.form.garnish')}
            </label>
            <input
              id="cocktail-garnish"
              type="text"
              value={formData.garnish}
              onChange={(e) =>
                setFormData({ ...formData, garnish: e.target.value })
              }
              className="form-input"
              placeholder={t('cocktails.form.garnishPlaceholder')}
              aria-label={t('cocktails.form.garnish')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cocktail-prep-time" className="form-group-label">
              {t('cocktails.form.preparationTime')}
            </label>
            <input
              id="cocktail-prep-time"
              type="number"
              value={formData.preparationTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preparationTime: parseInt(e.target.value),
                })
              }
              className="form-input"
              min="1"
              placeholder={t('cocktails.form.preparationTimePlaceholder')}
              aria-label={t('cocktails.form.preparationTime')}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">{t('cocktails.form.image')}</h3>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
              }
            }}
            className="form-input"
            aria-label={t('cocktails.form.uploadImage')}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="form-button form-button-secondary"
        >
          {t('common.cancel')}
        </button>
        <button type="submit" className="form-button form-button-primary">
          {cocktail ? t('common.save') : t('common.add')}
        </button>
      </div>
    </form>
  );
};

const CocktailsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCocktail, setEditingCocktail] = useState<
    CocktailRecipe | undefined
  >();
  const [searchTerm, setSearchTerm] = useState('');
  const { cocktails, loading, error } = useCocktails();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // Filter cocktails based on search term
  const filteredCocktails = cocktails.filter((cocktail) => {
    const matchesSearch =
      cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cocktail.description?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      );
    return matchesSearch;
  });

  const handleAddCocktail = async (
    cocktailData: Partial<CocktailRecipe>,
    imageFile?: File
  ) => {
    try {
      let createdOrUpdatedCocktail;
      if (editingCocktail?._id) {
        createdOrUpdatedCocktail = await dispatch(
          updateCocktail({
            id: editingCocktail._id,
            data: cocktailData,
          })
        ).unwrap();
        toast.success(t('cocktails.messages.updated'));
      } else {
        createdOrUpdatedCocktail = await dispatch(
          addCocktail(cocktailData)
        ).unwrap();
        toast.success(t('cocktails.messages.created'));
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
      toast.error(t('cocktails.messages.error'));
    }
  };

  const handleEditCocktail = (cocktail: CocktailRecipe) => {
    setEditingCocktail(cocktail);
    setShowForm(true);
  };

  const handleDeleteCocktail = async (cocktailId: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      await dispatch(deleteCocktail(cocktailId));
    }
  };

  const renderDialogs = () => {
    return ReactDOM.createPortal(
      <>
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
      {renderDialogs()}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="cocktail-search" className="sr-only">
                {t('cocktails.search')}
              </label>
              <input
                id="cocktail-search"
                type="text"
                placeholder={t('cocktails.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full md:w-96 px-4 py-2 rounded-md border-2 border-black bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors duration-200"
                aria-label={t('cocktails.search')}
              />
            </div>
            <AddNewButton
              onClick={() => setShowForm(true)}
              title={t('cocktails.addCocktail')}
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {t('cocktails.title')}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredCocktails.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCocktails.map((cocktail) => (
              <div
                key={cocktail._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {cocktail.imageData && (
                  <div className="relative h-48 w-full">
                    <img
                      src={cocktail.imageData.url}
                      alt={cocktail.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {cocktail.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {cocktail.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ${cocktail.price.toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cocktail.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cocktail.isAvailable
                        ? t('cocktails.status.available')
                        : t('cocktails.status.unavailable')}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  <button
                    onClick={() => handleEditCocktail(cocktail)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteCocktail(cocktail._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('common.delete')}
                  </button>
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
