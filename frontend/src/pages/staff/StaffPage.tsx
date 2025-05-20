import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { User } from '../../services/authService';

const StaffPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: User | null;
  };

  // Only allow admin access
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-red-500">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Staff Management</h1>

        {/* Staff list will go here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">
            Staff management features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
