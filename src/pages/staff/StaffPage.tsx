import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

const initialFormData: FormData = {
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
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { staff, loading, error } = useSelector(
    (state: RootState) => state.staff
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

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
      const staffData = { ...formData };
      delete staffData.confirmPassword;

      if (editingStaff) {
        await dispatch(
          updateStaff({ id: editingStaff.id, staffData })
        ).unwrap();
        alert('Staff member updated successfully');
      } else {
        await dispatch(createStaff(staffData)).unwrap();
        alert('Staff member added successfully');
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          {t('common.error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('staff.title')}</h1>
        <button
          type="button"
          onClick={() => {
            setEditingStaff(null);
            setFormData(initialFormData);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={t('staff.addStaff')}
          title={t('staff.addStaff')}
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t('staff.addStaff')}
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder={t('staff.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-label={t('staff.search')}
          title={t('staff.search')}
        />
        <div className="flex gap-4">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            aria-label={t('staff.rowsPerPage')}
            title={t('staff.rowsPerPage')}
          >
            <option value={5}>5 {t('staff.rowsPerPage')}</option>
            <option value={10}>10 {t('staff.rowsPerPage')}</option>
            <option value={20}>20 {t('staff.rowsPerPage')}</option>
            <option value={50}>50 {t('staff.rowsPerPage')}</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  setSortField('firstName');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}
              >
                {t('staff.table.name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  setSortField('email');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}
              >
                {t('staff.table.email')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  setSortField('position');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}
              >
                {t('staff.table.position')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  setSortField('isActive');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}
              >
                {t('staff.table.status')}
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">{t('staff.table.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStaff.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{member.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.isActive
                      ? t('staff.status.active')
                      : t('staff.status.inactive')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    aria-label={t('staff.table.edit')}
                    title={t('staff.table.edit')}
                  >
                    <span className="sr-only">{t('staff.table.edit')}</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={t('staff.table.delete')}
                    title={t('staff.table.delete')}
                  >
                    <span className="sr-only">{t('staff.table.delete')}</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            type="button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            aria-label={t('common.pagination.previous')}
            title={t('common.pagination.previous')}
          >
            {t('common.pagination.previous')}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            aria-label={t('common.pagination.next')}
            title={t('common.pagination.next')}
          >
            {t('common.pagination.next')}
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t('common.pagination.showing')}{' '}
              <span className="font-medium">
                {(currentPage - 1) * rowsPerPage + 1}
              </span>{' '}
              {t('common.pagination.to')}{' '}
              <span className="font-medium">
                {Math.min(currentPage * rowsPerPage, filteredStaff.length)}
              </span>{' '}
              {t('common.pagination.of')}{' '}
              <span className="font-medium">{filteredStaff.length}</span>{' '}
              {t('common.pagination.results')}
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                aria-label={t('common.pagination.previous')}
                title={t('common.pagination.previous')}
              >
                <span className="sr-only">
                  {t('common.pagination.previous')}
                </span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                    aria-label={`${t('common.pagination.showing')} ${page}`}
                    title={`${t('common.pagination.showing')} ${page}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                aria-label={t('common.pagination.next')}
                title={t('common.pagination.next')}
              >
                <span className="sr-only">{t('common.pagination.next')}</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingStaff
                          ? t('staff.form.title.edit')
                          : t('staff.form.title.add')}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t('staff.form.firstName')}
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              aria-label={t('staff.form.firstName')}
                              title={t('staff.form.firstName')}
                              placeholder={t('staff.form.firstName')}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              {t('staff.form.lastName')}
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              aria-label={t('staff.form.lastName')}
                              title={t('staff.form.lastName')}
                              placeholder={t('staff.form.lastName')}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.email')}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.email')}
                            title={t('staff.form.email')}
                            placeholder={t('staff.form.email')}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.position')}
                          </label>
                          <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.position')}
                            title={t('staff.form.position')}
                            placeholder={t('staff.form.position')}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone.countryCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.phone')}
                          </label>
                          <div className="flex gap-2">
                            <select
                              id="phone.countryCode"
                              name="phone.countryCode"
                              value={formData.phone.countryCode}
                              onChange={handleInputChange}
                              className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              aria-label={t('staff.form.phone')}
                              title={t('staff.form.phone')}
                            >
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                              <option value="+46">+46</option>
                            </select>
                            <input
                              type="tel"
                              id="phone.number"
                              name="phone.number"
                              value={formData.phone.number}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              aria-label={t('staff.form.phone')}
                              title={t('staff.form.phone')}
                              placeholder={t('staff.form.phone')}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="employmentType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.employmentType')}
                          </label>
                          <select
                            id="employmentType"
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.employmentType')}
                            title={t('staff.form.employmentType')}
                          >
                            <option value="FULL_TIME">
                              {t('staff.employmentTypes.FULL_TIME')}
                            </option>
                            <option value="PART_TIME">
                              {t('staff.employmentTypes.PART_TIME')}
                            </option>
                            <option value="CONTRACT">
                              {t('staff.employmentTypes.CONTRACT')}
                            </option>
                            <option value="INTERN">
                              {t('staff.employmentTypes.INTERN')}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.startDate')}
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.startDate')}
                            title={t('staff.form.startDate')}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.role')}
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.role')}
                            title={t('staff.form.role')}
                          >
                            <option value="STAFF">
                              {t('staff.roles.STAFF')}
                            </option>
                            <option value="MANAGER">
                              {t('staff.roles.MANAGER')}
                            </option>
                            <option value="ADMIN">
                              {t('staff.roles.ADMIN')}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="isActive"
                            className="block text-sm font-medium text-gray-700"
                          >
                            {t('staff.form.status')}
                          </label>
                          <select
                            id="isActive"
                            name="isActive"
                            value={formData.isActive ? 'true' : 'false'}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isActive: e.target.value === 'true',
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            aria-label={t('staff.form.status')}
                            title={t('staff.form.status')}
                          >
                            <option value="true">
                              {t('staff.status.active')}
                            </option>
                            <option value="false">
                              {t('staff.status.inactive')}
                            </option>
                          </select>
                        </div>

                        {!editingStaff && (
                          <>
                            <div>
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {t('staff.form.password')}
                              </label>
                              <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                                aria-label={t('staff.form.password')}
                                title={t('staff.form.password')}
                                placeholder={t('staff.form.password')}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {t('staff.form.confirmPassword')}
                              </label>
                              <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                                aria-label={t('staff.form.confirmPassword')}
                                title={t('staff.form.confirmPassword')}
                                placeholder={t('staff.form.confirmPassword')}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    aria-label={
                      editingStaff
                        ? t('staff.form.submit.edit')
                        : t('staff.form.submit.add')
                    }
                    title={
                      editingStaff
                        ? t('staff.form.submit.edit')
                        : t('staff.form.submit.add')
                    }
                  >
                    {editingStaff
                      ? t('staff.form.submit.edit')
                      : t('staff.form.submit.add')}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData(initialFormData);
                      setEditingStaff(null);
                    }}
                    aria-label={t('staff.form.cancel')}
                    title={t('staff.form.cancel')}
                  >
                    {t('staff.form.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
