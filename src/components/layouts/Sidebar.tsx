import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import SidebarAccordion from './SidebarAccordion';

interface SubMenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
}

const DrinksIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const CocktailsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);

const NewOrderIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const OrderHistoryIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const LoyaltyIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CustomersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ReportsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems: MenuItem[] = [
    // Core Navigation
    {
      title: t('navigation.dashboard'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: `/${i18n.language}/home`,
    },
    {
      title: t('navigation.menu'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      subItems: [
        {
          title: t('navigation.drinks'),
          path: `/${i18n.language}/drinks`,
          icon: <DrinksIcon />,
        },
        {
          title: t('navigation.cocktails'),
          path: `/${i18n.language}/cocktails`,
          icon: <CocktailsIcon />,
        },
      ],
    },
    {
      title: t('navigation.orders'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      subItems: [
        {
          title: t('navigation.addOrder'),
          path: `/${i18n.language}/orders/new`,
          icon: <NewOrderIcon />,
        },
        {
          title: t('navigation.ordersList'),
          path: `/${i18n.language}/orders`,
          icon: <OrderHistoryIcon />,
        },
      ],
    },
    {
      title: t('navigation.tables'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      path: `/${i18n.language}/tables`,
    },
    // Management Section
    {
      title: t('navigation.staff'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      path: `/${i18n.language}/staff`,
    },
    {
      title: t('navigation.schedule'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      path: `/${i18n.language}/schedule`,
    },
    {
      title: t('navigation.messages'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      path: `/${i18n.language}/messages`,
    },
    {
      title: t('navigation.inventory'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      path: `/${i18n.language}/inventory`,
    },
    {
      title: t('navigation.reports'),
      icon: <ReportsIcon />,
      path: `/${i18n.language}/reports`,
    },
    {
      title: t('navigation.files'),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      path: `/${i18n.language}/files`,
    },
    {
      title: t('navigation.customers'),
      icon: <CustomersIcon />,
      subItems: [
        {
          title: t('navigation.loyaltyProgram'),
          path: `/${i18n.language}/loyalty`,
          icon: <LoyaltyIcon />,
        },
        {
          title: t('navigation.customerProfiles'),
          path: `/${i18n.language}/customers`,
          icon: <CustomersIcon />,
        },
        {
          title: t('navigation.loyaltyReports'),
          path: `/${i18n.language}/loyalty-reports`,
          icon: <ReportsIcon />,
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen">
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-oxford-blue transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-french-gray">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white">Bar Manager</h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-charcoal focus:outline-none"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {/* Rest of sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              {/* First Group - Core Navigation */}
              {menuItems.slice(0, 4).map((item) => (
                <div key={item.title} className="mb-2">
                  {item.subItems ? (
                    <SidebarAccordion
                      title={item.title}
                      icon={item.icon}
                      subLinks={item.subItems.map((subItem) => ({
                        path: subItem.path,
                        label: subItem.title,
                        icon: subItem.icon,
                      }))}
                      isCollapsed={isCollapsed}
                    />
                  ) : (
                    <Link
                      to={item.path!}
                      className={`flex items-center px-4 py-2 text-papaya-whip rounded-lg hover:bg-oxford-blue/20 ${
                        location.pathname === item.path
                          ? 'bg-oxford-blue/20 text-peach'
                          : ''
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </Link>
                  )}
                </div>
              ))}

              {/* Separator */}
              <div className="my-4 border-t border-french-gray" />

              {/* Second Group - Management */}
              {menuItems.slice(4).map((item) => (
                <div key={item.title} className="mb-2">
                  {item.subItems ? (
                    <SidebarAccordion
                      title={item.title}
                      icon={item.icon}
                      subLinks={item.subItems.map((subItem) => ({
                        path: subItem.path,
                        label: subItem.title,
                        icon: subItem.icon,
                      }))}
                      isCollapsed={isCollapsed}
                    />
                  ) : (
                    <Link
                      to={item.path!}
                      className={`flex items-center px-4 py-2 text-papaya-whip rounded-lg hover:bg-oxford-blue/20 ${
                        location.pathname === item.path
                          ? 'bg-oxford-blue/20 text-peach'
                          : ''
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto border-t border-gray-700 pt-4">
            <div className="px-2 space-y-1">
              <Link
                to={`/${i18n.language}/profile`}
                className={`flex items-center px-4 py-2 text-papaya-whip rounded-lg hover:bg-oxford-blue/20 ${
                  location.pathname === `/${i18n.language}/profile`
                    ? 'bg-oxford-blue/20 text-peach'
                    : ''
                }`}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="ml-3">{t('navigation.profile')}</span>
                )}
              </Link>
              <Link
                to={`/${i18n.language}/settings`}
                className={`flex items-center px-4 py-2 text-papaya-whip rounded-lg hover:bg-oxford-blue/20 ${
                  location.pathname === `/${i18n.language}/settings`
                    ? 'bg-oxford-blue/20 text-peach'
                    : ''
                }`}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="ml-3">{t('navigation.settings')}</span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-papaya-whip rounded-lg hover:bg-oxford-blue/20 hover:text-peach"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="ml-3">{t('navigation.logout')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content area */}
      <div
        className={`flex-1 min-h-screen ${
          isCollapsed ? 'ml-16' : 'ml-64'
        } bg-french-gray transition-all duration-300`}
      >
        <div className="h-full bg-french-gray">
          {/* Rest of the component */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
