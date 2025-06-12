import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/store';
import { updateProfile, logout } from '../../redux/slices/authSlice';
import { countries } from '../../utils/countries';
import defaultProfileImage from '../../assets/default-profile.svg';
import { User } from '../../types/user';

type FormData = Omit<User, 'id'> & {
  phone: NonNullable<User['phone']>;
  address: NonNullable<User['address']>;
};

const initialFormData: FormData = {
  email: '',
  name: '',
  firstName: '',
  lastName: '',
  role: 'staff',
  active: true,
  phone: {
    countryCode: '+1',
    number: '',
  },
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  createdAt: '',
  updatedAt: '',
  profilePicture: '',
};

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'staff',
        active: user.active ?? true,
        phone: user.phone || {
          countryCode: '+1',
          number: '',
        },
        address: user.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        createdAt: user.createdAt || '',
        updatedAt: user.updatedAt || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentValue = prev[parent as keyof FormData];
        if (parentValue && typeof parentValue === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      active: e.target.value === 'true',
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data to current user data when canceling edit
      if (user) {
        setFormData({
          email: user.email || '',
          name: user.name || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role || 'staff',
          active: user.active ?? true,
          phone: user.phone || {
            countryCode: '+1',
            number: '',
          },
          address: user.address || {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
          },
          createdAt: user.createdAt || '',
          updatedAt: user.updatedAt || '',
          profilePicture: user.profilePicture || '',
        });
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h2>
              <div className="space-x-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="profile-form"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            <form
              id="profile-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={formData.profilePicture || defaultProfileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors duration-200 shadow-lg"
                      title="Change profile picture"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="sr-only">Change profile picture</span>
                    </label>
                  )}
                  <input
                    type="file"
                    id="profile-picture"
                    name="profile-picture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={!isEditing}
                    aria-label="Profile picture upload"
                    title="Upload profile picture"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Email address"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Full name"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="User role"
                      title="Select user role"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="active"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="active"
                      name="active"
                      value={formData.active ? 'true' : 'false'}
                      onChange={handleActiveChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Account status"
                      title="Select account status"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Contact Information
                  </h3>

                  <div>
                    <label
                      htmlFor="phone-country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country Code
                    </label>
                    <select
                      id="phone-country"
                      name="phone.countryCode"
                      value={formData.phone.countryCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-24 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Phone country code"
                      title="Select country code"
                    >
                      {countries.map((country) => (
                        <option
                          key={`${country.code}-${country.name}`}
                          value={country.code}
                        >
                          {country.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      name="phone.number"
                      value={formData.phone.number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isEditing
                          ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                      aria-label="Phone number"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="md:col-span-2 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="address-street"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address
                      </label>
                      <input
                        id="address-street"
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isEditing
                            ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                        }`}
                        aria-label="Street address"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address-city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        id="address-city"
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isEditing
                            ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                        }`}
                        aria-label="City"
                        placeholder="Enter your city"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address-state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State/Province
                      </label>
                      <input
                        id="address-state"
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isEditing
                            ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                        }`}
                        aria-label="State or province"
                        placeholder="Enter your state or province"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address-postal"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal Code
                      </label>
                      <input
                        id="address-postal"
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isEditing
                            ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                        }`}
                        aria-label="Postal code"
                        placeholder="Enter your postal code"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address-country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <input
                        id="address-country"
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                          isEditing
                            ? 'border-gray-300 focus:border-gray-800 focus:ring-gray-800'
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                        }`}
                        aria-label="Country"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
