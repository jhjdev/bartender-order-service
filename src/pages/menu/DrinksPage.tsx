import { useState, useEffect } from 'react';
import { Drink, DrinkCategory } from '../../types/drink';
import {
  createDrink,
  deleteDrink,
  fetchDrinks,
} from '../../redux/slices/drinksSlice';
import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import AddNewButton from '../../components/common/AddNewButton';
import '../../styles/forms.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

const categories = [
  { value: DrinkCategory.DRAFT_BEER, label: 'Draft Beer' },
  { value: DrinkCategory.BOTTLED_BEER, label: 'Bottled Beer' },
  { value: DrinkCategory.WINE, label: 'Wine' },
  { value: DrinkCategory.SPIRIT, label: 'Spirits' },
  { value: DrinkCategory.NON_ALCOHOLIC, label: 'Non-Alcoholic' },
];

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
          <label htmlFor="drink-name" className="form-group-label">
            Name
          </label>
          <input
            id="drink-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
            placeholder="Enter drink name"
            aria-label="Drink name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="drink-category" className="form-group-label">
            Category
          </label>
          <select
            id="drink-category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as DrinkCategory,
              })
            }
            className="form-input"
            required
            aria-label="Drink category"
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
          <label htmlFor="drink-price" className="form-group-label">
            Price
          </label>
          <input
            id="drink-price"
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
            placeholder="Enter price"
            aria-label="Drink price"
          />
        </div>

        <div className="form-group">
          <label htmlFor="drink-description" className="form-group-label">
            Description
          </label>
          <textarea
            id="drink-description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input"
            rows={3}
            placeholder="Enter drink description"
            aria-label="Drink description"
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Availability</h3>
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
                  aria-label="Set drink as available"
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
                  aria-hidden="true"
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
                  aria-label="Set drink as unavailable"
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
                  aria-hidden="true"
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
              <label htmlFor="alcohol-percentage" className="form-group-label">
                Alcohol Percentage
              </label>
              <input
                id="alcohol-percentage"
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
                placeholder="Enter alcohol percentage"
                aria-label="Alcohol percentage"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brewery" className="form-group-label">
                Brewery
              </label>
              <input
                id="brewery"
                type="text"
                value={formData.brewery}
                onChange={(e) =>
                  setFormData({ ...formData, brewery: e.target.value })
                }
                className="form-input"
                placeholder="Enter brewery name"
                aria-label="Brewery name"
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
              <label htmlFor="wine-type" className="form-group-label">
                Wine Type
              </label>
              <input
                id="wine-type"
                type="text"
                value={formData.wineType}
                onChange={(e) =>
                  setFormData({ ...formData, wineType: e.target.value })
                }
                className="form-input"
                placeholder="Enter wine type"
                aria-label="Wine type"
              />
            </div>

            <div className="form-group">
              <label htmlFor="region" className="form-group-label">
                Region
              </label>
              <input
                id="region"
                type="text"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="form-input"
                placeholder="Enter wine region"
                aria-label="Wine region"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year" className="form-group-label">
                Year
              </label>
              <input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="form-input"
                placeholder="Enter vintage year"
                aria-label="Vintage year"
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
              <label htmlFor="distillery" className="form-group-label">
                Distillery
              </label>
              <input
                id="distillery"
                type="text"
                value={formData.distillery}
                onChange={(e) =>
                  setFormData({ ...formData, distillery: e.target.value })
                }
                className="form-input"
                placeholder="Enter distillery name"
                aria-label="Distillery name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age-statement" className="form-group-label">
                Age Statement
              </label>
              <input
                id="age-statement"
                type="text"
                value={formData.ageStatement}
                onChange={(e) =>
                  setFormData({ ...formData, ageStatement: e.target.value })
                }
                className="form-input"
                placeholder="Enter age statement"
                aria-label="Age statement"
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <h3 className="form-section-title">Image</h3>
        <div className="form-group">
          <label htmlFor="drink-image" className="form-label">
            Drink Image
          </label>
          <input
            id="drink-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0])}
            className="form-file-input"
            aria-label="Upload drink image"
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

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          title="Cancel form"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" title="Save drink">
          {drink ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

const DrinksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { drinks, loading } = useSelector((state: RootState) => state.drinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t } = useTranslation();

  useEffect(() => {
    const loadDrinks = async () => {
      try {
        await dispatch(fetchDrinks()).unwrap();
      } catch (error) {
        toast.error('Failed to fetch drinks', {
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
    loadDrinks();
  }, [dispatch]);

  // Filter drinks based on search term and selected category
  const filteredDrinks = drinks.filter((drink) => {
    const matchesSearch =
      searchTerm === '' ||
      drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drink.description?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      );

    const matchesCategory =
      selectedCategory === 'all' || drink.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddDrink = async (drinkData: Partial<Drink>) => {
    try {
      await dispatch(createDrink(drinkData)).unwrap();
      toast.success('Drink added successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add drink', {
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

  const handleDeleteDrink = async (drinkId: string) => {
    try {
      await dispatch(deleteDrink(drinkId)).unwrap();
      toast.success('Drink deleted successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      toast.error('Failed to delete drink', {
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

  const renderDialogs = () => {
    return ReactDOM.createPortal(
      <>
        {isModalOpen && (
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
                drink={selectedDrink}
                onSubmit={handleAddDrink}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedDrink(undefined);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-grow">
            <label htmlFor="drink-search" className="sr-only">
              {t('drinks.search')}
            </label>
            <input
              id="drink-search"
              type="text"
              placeholder={t('drinks.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full md:w-96 px-4 py-2 rounded-md border-2 border-black bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-colors duration-200"
              aria-label={t('drinks.search')}
            />
          </div>
          <AddNewButton
            onClick={() => setIsModalOpen(true)}
            title={t('drinks.addDrink')}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Drinks
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">{t('drinks.title')}</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      ) : filteredDrinks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrinks.map((drink) => (
            <div
              key={drink._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {drink.imageData && (
                <div className="relative h-48 w-full">
                  <img
                    src={drink.imageData.url}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {drink.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {drink.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${drink.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      drink.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {drink.isAvailable
                      ? t('drinks.status.available')
                      : t('drinks.status.unavailable')}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedDrink(drink);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDeleteDrink(drink._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderDialogs()}
    </div>
  );
};

export default DrinksPage;
