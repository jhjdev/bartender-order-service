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
  endDate?: string;
  leaveType?:
    | 'MATERNITY'
    | 'PATERNITY'
    | 'STUDY'
    | 'SICK'
    | 'VACATION'
    | 'TERMINATED'
    | 'OTHER';
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
                  <div key="phone">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="phone.countryCode"
                        value={formData.phone.countryCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+46">+46</option>
                      </select>
                      <input
                        type="tel"
                        name="phone.number"
                        value={formData.phone.number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                  </div>
                  <div key="employmentType">
                    <label className="block text-sm font-medium text-gray-700">
                      Employment Type
                    </label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="TEMPORARY">Temporary</option>
                    </select>
                  </div>
                  <div key="startDate">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div key="endDate">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate || ''}
                      onChange={handleInputChange}
                      disabled={formData.isActive}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100"
                    />
                  </div>
                  <div
                    key="isActive"
                    className="col-span-2 flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4 h-20"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                            endDate: e.target.checked ? '' : prev.endDate,
                          }));
                        }}
                        className="h-6 w-6 rounded border-2 border-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-emerald-50 checked:border-emerald-500 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2310b981%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16.707%205.293a1%201%200%20010%201.414l-8%208a1%201%200%2001-1.414%200l-4-4a1%201%200%20011.414-1.414L8%2012.586l7.293-7.293a1%201%200%20011.414%200z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
                      />
                      <label className="ml-3 block text-base font-semibold text-gray-700">
                        {formData.isActive
                          ? 'Active Employee'
                          : 'Inactive Employee'}
                      </label>
                    </div>
                    {!formData.isActive && (
                      <div className="flex items-center space-x-4">
                        <select
                          name="leaveType"
                          value={formData.leaveType || ''}
                          onChange={handleInputChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0"
                        >
                          <option value="" className="text-gray-500">
                            Select Reason
                          </option>
                          <option value="MATERNITY" className="text-gray-700">
                            Maternity Leave
                          </option>
                          <option value="PATERNITY" className="text-gray-700">
                            Paternity Leave
                          </option>
                          <option value="STUDY" className="text-gray-700">
                            Study Leave
                          </option>
                          <option value="SICK" className="text-gray-700">
                            Sick Leave
                          </option>
                          <option value="VACATION" className="text-gray-700">
                            Vacation
                          </option>
                          <option value="TERMINATED" className="text-gray-700">
                            Employment Terminated
                          </option>
                          <option value="OTHER" className="text-gray-700">
                            Other
                          </option>
                        </select>
                        <div className="text-sm text-gray-600">
                          Set end date above
                        </div>
                      </div>
                    )}
                  </div>
                  <div key="address" className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Street"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                  <div key="emergencyContact" className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleInputChange}
                        placeholder="Contact Name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                        placeholder="Relationship"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Emergency Contact Phone
                        </label>
                        <div className="flex gap-2">
                          <select
                            name="emergencyContact.phone.countryCode"
                            value={formData.emergencyContact.phone.countryCode}
                            onChange={handleInputChange}
                            className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2"
                          >
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+46">+46</option>
                          </select>
                          <input
                            type="tel"
                            name="emergencyContact.phone.number"
                            value={formData.emergencyContact.phone.number}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                      </div>
                    </div>
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
                  key="status-header"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('isActive')}
                >
                  Status
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
                    key={`${member.id}-status-${index}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
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
