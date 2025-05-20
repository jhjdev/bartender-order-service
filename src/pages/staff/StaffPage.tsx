import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../../redux/slices/staffSlice';
import { Staff } from '../../types/staff';

type FormData = Omit<Staff, 'id' | 'createdAt' | 'updatedAt'> & {
  confirmPassword?: string;
};

// Utility function to omit keys from an object
function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

const StaffPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, loading, error } = useSelector(
    (state: RootState) => state.staff
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Add effect to handle body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
    gender: 'OTHER',
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
    role: 'STAFF',
    password: '',
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Staff>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match if creating new staff
    if (!editingStaff && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate password length if creating new staff
    if (!editingStaff && formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      if (editingStaff) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...staffData } = formData;
        await dispatch(
          updateStaff({ id: editingStaff.id, staffData })
        ).unwrap();
        alert('Staff member updated successfully');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...staffData } = formData;
        await dispatch(createStaff(staffData)).unwrap();
        alert('Staff member added successfully');
      }
      setIsModalOpen(false);
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
        gender: 'OTHER',
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
        role: 'STAFF',
        password: '',
      });
      setEditingStaff(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    const rest = omit(staff, ['id', 'createdAt', 'updatedAt']);
    setFormData({
      ...rest,
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await dispatch(deleteStaff(id)).unwrap();
        alert('Staff member deleted successfully');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  // Filter and sort staff
  const filteredStaff = useMemo(() => {
    return staff
      .filter((member) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          member.firstName.toLowerCase().includes(searchLower) ||
          member.lastName.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.position.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
  }, [staff, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (field: keyof Staff) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Modal - Moved outside the main container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50">
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto max-h-[calc(100vh-200px)]"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div key="firstName">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div key="lastName">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div key="email">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div key="position">
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  {!editingStaff && (
                    <React.Fragment key="password-fields">
                      <div key="password">
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>
                      <div key="confirmPassword">
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>
                    </React.Fragment>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {editingStaff ? 'Update' : 'Add'} Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <button
            onClick={() => {
              setEditingStaff(null);
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
                gender: 'OTHER',
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
                role: 'STAFF',
                password: '',
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Staff Member
          </button>
        </div>

        {/* Search and filter controls */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
        </div>

        {/* Staff table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr key="header-row">
                <th
                  key="name-header"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  Name
                </th>
                <th
                  key="email-header"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email
                </th>
                <th
                  key="position-header"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('position')}
                >
                  Position
                </th>
                <th
                  key="actions-header"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStaff.map((member, index) => (
                <tr key={`${member.id}-${index}`} className="hover:bg-gray-50">
                  <td
                    key={`${member.id}-name-${index}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {member.firstName} {member.lastName}
                  </td>
                  <td
                    key={`${member.id}-email-${index}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {member.email}
                  </td>
                  <td
                    key={`${member.id}-position-${index}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {member.position}
                  </td>
                  <td
                    key={`${member.id}-actions-${index}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      key={`${member.id}-edit-${index}`}
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      key={`${member.id}-delete-${index}`}
                      onClick={() => handleDelete(member.id)}
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

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {[5, 10, 20, 50].map((value) => (
                <option key={`rows-${value}`} value={value}>
                  {value} per page
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              key="prev-page"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span key="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              key="next-page"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffPage;
