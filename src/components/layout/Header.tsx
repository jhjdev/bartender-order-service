import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import UserMenu from '../auth/UserMenu';

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="bg-peach border-b border-oxford-blue/20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-charcoal hover:text-oxford-blue">
              <span className="text-xl font-bold">Bar Manager</span>
            </Link>
          </div>
          <div className="flex items-center">{user && <UserMenu />}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
