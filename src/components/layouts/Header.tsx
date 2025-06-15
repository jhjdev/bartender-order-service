import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { fetchSettings } from '../../redux/slices/settingsSlice';
import UserMenu from '../auth/UserMenu';

const Header: React.FC = () => {
  const settings = useAppSelector((state) => state.settings.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <header className="bg-peach border-b border-oxford-blue/20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-charcoal hover:text-oxford-blue">
              <h1 className="h1">
                {settings?.orderSettings?.businessName || 'Bar Manager'}
              </h1>
            </Link>
          </div>
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
