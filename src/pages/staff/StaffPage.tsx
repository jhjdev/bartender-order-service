import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addStaff,
  updateStaff,
  deleteStaff,
  fetchStaff,
  StaffMember,
} from '../../redux/slices/staffSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import { countries } from '../../utils/countries';
import { validatePhoneNumber } from '../../utils/phoneValidation';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import styles from './StaffPage.module.css';

type FormData = Omit<StaffMember, 'id'>;

const StaffPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staff = useSelector((state: RootState) => state.staff.staff);
  const loading = useSelector((state: RootState) => state.staff.loading);
  const error = useSelector((state: RootState) => state.staff.error);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: {
      countryCode: '+1',
      number: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: {
        countryCode: '+1',
        number: '',
      },
    },
    employmentType: 'FULL_TIME',
    age: 0,
    gender: 'PREFER_NOT_TO_SAY',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    startDate: '',
    position: '',
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log('Input change:', { name, value });

    setFormData((prev) => {
      if (name.includes('.')) {
        const parts = name.split('.');
        console.log('Field parts:', parts);

        if (parts[0] === 'phone') {
          return {
            ...prev,
            phone: {
              countryCode:
                parts[1] === 'countryCode' ? value : prev.phone.countryCode,
              number: parts[1] === 'number' ? value : prev.phone.number,
            },
          };
        } else if (parts[0] === 'emergencyContact') {
          if (parts[1] === 'phone') {
            return {
              ...prev,
              emergencyContact: {
                ...prev.emergencyContact,
                phone: {
                  countryCode:
                    parts[2] === 'countryCode'
                      ? value
                      : prev.emergencyContact.phone.countryCode,
                  number:
                    parts[2] === 'number'
                      ? value
                      : prev.emergencyContact.phone.number,
                },
              },
            };
          } else {
            return {
              ...prev,
              emergencyContact: {
                ...prev.emergencyContact,
                [parts[1]]: value,
              },
            };
          }
        } else if (parts[0] === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [parts[1]]: value,
            },
          };
        }
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form. editingId:', editingId); // Debug log

    // Validate phone numbers
    const phoneValidation = validatePhoneNumber(
      formData.phone.countryCode,
      formData.phone.number
    );

    const emergencyPhoneValidation = validatePhoneNumber(
      formData.emergencyContact.phone.countryCode,
      formData.emergencyContact.phone.number
    );

    if (!phoneValidation.isValid) {
      alert(`Invalid phone number: ${phoneValidation.error}`);
      return;
    }

    if (!emergencyPhoneValidation.isValid) {
      alert(
        `Invalid emergency contact phone number: ${emergencyPhoneValidation.error}`
      );
      return;
    }

    // Format phone numbers
    const formattedData = {
      ...formData,
      phone: {
        countryCode: formData.phone.countryCode,
        number: phoneValidation.formattedNumber,
      },
      emergencyContact: {
        ...formData.emergencyContact,
        phone: {
          countryCode: formData.emergencyContact.phone.countryCode,
          number: emergencyPhoneValidation.formattedNumber,
        },
      },
    };

    try {
      if (editingId) {
        console.log('Updating staff member:', {
          id: editingId,
          data: formattedData,
        }); // Debug log
        const updateData = { _id: editingId, ...formattedData };
        console.log('Update data:', updateData); // Debug log
        await dispatch(updateStaff(updateData)).unwrap();
      } else {
        console.log('Creating new staff member:', formattedData); // Debug log
        await dispatch(addStaff(formattedData)).unwrap();
      }

      // Reset form and editing state
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: {
          countryCode: '+1',
          number: '',
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: {
            countryCode: '+1',
            number: '',
          },
        },
        employmentType: 'FULL_TIME',
        age: 0,
        gender: 'PREFER_NOT_TO_SAY',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        startDate: '',
        position: '',
        isActive: true,
      });
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save staff member:', err);
      alert('Failed to save staff member. Please try again.');
    }
  };

  const handleEdit = (staffMember: StaffMember) => {
    console.log('Editing staff member:', staffMember); // Debug log
    if (!staffMember._id) {
      console.error('Staff member has no _id');
      return;
    }
    // Format phone numbers if they exist
    const formattedPhone = staffMember.phone?.number
      ? staffMember.phone.number.replace(/[^\d+]/g, '')
      : '';
    const formattedEmergencyPhone = staffMember.emergencyContact?.phone?.number
      ? staffMember.emergencyContact.phone.number.replace(/[^\d+]/g, '')
      : '';

    setFormData({
      firstName: staffMember.firstName || '',
      lastName: staffMember.lastName || '',
      email: staffMember.email || '',
      phone: {
        countryCode: staffMember.phone?.countryCode || '+1',
        number: formattedPhone,
      },
      emergencyContact: {
        name: staffMember.emergencyContact?.name || '',
        relationship: staffMember.emergencyContact?.relationship || '',
        phone: {
          countryCode: staffMember.emergencyContact?.phone?.countryCode || '+1',
          number: formattedEmergencyPhone,
        },
      },
      employmentType: staffMember.employmentType || 'FULL_TIME',
      age: staffMember.age || 0,
      gender: staffMember.gender || 'PREFER_NOT_TO_SAY',
      dateOfBirth: staffMember.dateOfBirth || '',
      address: {
        street: staffMember.address?.street || '',
        city: staffMember.address?.city || '',
        state: staffMember.address?.state || '',
        postalCode: staffMember.address?.postalCode || '',
        country: staffMember.address?.country || '',
      },
      startDate: staffMember.startDate || '',
      position: staffMember.position || '',
      isActive: staffMember.isActive ?? true,
    });
    setEditingId(staffMember._id);
    console.log('Set editingId to:', staffMember._id); // Debug log
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('No id provided for deletion');
      return;
    }
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await dispatch(deleteStaff(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete staff member:', err);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className={`mb-8 bg-white p-4 rounded shadow ${styles.formContainer}`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="flex gap-2 items-center">
              <div className="w-20">
                <FormSelect
                  name="phone.countryCode"
                  value={formData.phone.countryCode}
                  onChange={handleInputChange}
                  options={countries.map((country) => ({
                    value: country.code,
                    label: `${country.code} (${country.name})`,
                    key: `${country.code}-${country.name}`,
                  }))}
                  required
                />
              </div>
              <div className="flex-grow">
                <FormInput
                  name="phone.number"
                  type="tel"
                  value={formData.phone.number}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
          </div>
          <FormInput
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
          <FormSelect
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
            options={[
              { value: 'FULL_TIME', label: 'Full Time' },
              { value: 'PART_TIME', label: 'Part Time' },
            ]}
            required
          />
          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
              { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
            ]}
            required
          />
          <FormInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Emergency Contact */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleInputChange}
              required
            />
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Phone
              </label>
              <div className="flex gap-2 items-center">
                <div className="w-20">
                  <FormSelect
                    name="emergencyContact.phone.countryCode"
                    value={formData.emergencyContact.phone.countryCode}
                    onChange={handleInputChange}
                    options={countries.map((country) => ({
                      value: country.code,
                      label: `${country.code} (${country.name})`,
                      key: `${country.code}-${country.name}`,
                    }))}
                    required
                  />
                </div>
                <div className="flex-grow">
                  <FormInput
                    name="emergencyContact.phone.number"
                    type="tel"
                    value={formData.emergencyContact.phone.number}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Street"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Postal Code"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingId ? 'Update Staff Member' : 'Add Staff Member'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: {
                    countryCode: '+1',
                    number: '',
                  },
                  emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: {
                      countryCode: '+1',
                      number: '',
                    },
                  },
                  employmentType: 'FULL_TIME',
                  age: 0,
                  gender: 'PREFER_NOT_TO_SAY',
                  dateOfBirth: '',
                  address: {
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: '',
                  },
                  startDate: '',
                  position: '',
                  isActive: true,
                });
              }}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Staff Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={`staff-row-${member._id}`}>
                <td
                  key={`${member._id}-name`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </div>
                </td>
                <td
                  key={`${member._id}-position`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  <div className="text-sm text-gray-900">{member.position}</div>
                </td>
                <td
                  key={`${member._id}-email`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  <div className="text-sm text-gray-900">{member.email}</div>
                </td>
                <td
                  key={`${member._id}-phone`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  <div className="text-sm text-gray-900">
                    {member.phone.countryCode} {member.phone.number}
                  </div>
                </td>
                <td
                  key={`${member._id}-actions`}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  <button
                    key={`${member._id}-edit`}
                    onClick={() => handleEdit(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    key={`${member._id}-delete`}
                    onClick={() => handleDelete(member._id || '')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffPage;
