import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarCollapsed, toggleSidebar } from '../redux/slices/uiSlice';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onClose?: () => void;
}

// Icons as separate components for better organization
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const DrinksIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
    />
  </svg>
);

const CocktailsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const OrdersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const StaffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

const ScheduleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);

const TablesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
    />
  </svg>
);

const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

const FilesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const InventoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

interface NavItemProps {
  to: string;
  icon: React.FC;
  children: React.ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const NavItem = ({
  to,
  icon: Icon,
  children,
  onClick,
  isCollapsed,
}: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <div className="relative group">
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center ${
          isCollapsed ? 'justify-center' : 'px-4'
        } py-3 text-gray-300 rounded-lg transition-all duration-300 ${
          isActive
            ? 'bg-gray-700 text-white shadow-sm'
            : 'hover:bg-gray-700/50 hover:scale-[1.02]'
        }`}
      >
        <span
          className={`${
            isCollapsed ? '' : 'mr-3'
          } transition-colors duration-300 ${isActive ? 'text-cyan-400' : ''}`}
        >
          <Icon />
        </span>
        {!isCollapsed && (
          <span
            className={`transition-all duration-300 ${
              isActive ? 'font-medium' : ''
            }`}
          >
            {children}
          </span>
        )}
      </Link>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 whitespace-nowrap">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const toggleCollapse = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div
      className={`flex flex-col h-full bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">{t('navigation.dashboard')}</h1>
        )}
        <button
          onClick={toggleCollapse}
          className={`p-1 rounded-md hover:bg-gray-700 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {!isCollapsed && (
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 transition-opacity duration-300">
              {t('navigation.menu')}
            </h2>
          )}
          <NavItem
            to={`/${lang}/drinks`}
            icon={DrinksIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.drinks')}
          </NavItem>
          <NavItem
            to={`/${lang}/cocktails`}
            icon={CocktailsIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.cocktails')}
          </NavItem>
        </div>

        <div className="space-y-1">
          {!isCollapsed && (
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 transition-opacity duration-300">
              {t('navigation.orders')}
            </h2>
          )}
          <NavItem
            to={`/${lang}/orders`}
            icon={OrdersIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.ordersList')}
          </NavItem>
          <NavItem
            to={`/${lang}/orders/new`}
            icon={AddIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.addOrder')}
          </NavItem>
          <NavItem
            to={`/${lang}/tables`}
            icon={TablesIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.tables')}
          </NavItem>
        </div>

        <div className="space-y-1">
          {!isCollapsed && (
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 transition-opacity duration-300">
              {t('navigation.staff')}
            </h2>
          )}
          <NavItem
            to={`/${lang}/staff`}
            icon={StaffIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.staff')}
          </NavItem>
          <NavItem
            to={`/${lang}/schedule`}
            icon={ScheduleIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.schedule')}
          </NavItem>
          <NavItem
            to={`/${lang}/inventory`}
            icon={InventoryIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.inventory')}
          </NavItem>
        </div>

        <div className="space-y-1">
          {!isCollapsed && (
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 transition-opacity duration-300">
              {t('navigation.reports')}
            </h2>
          )}
          <NavItem
            to={`/${lang}/reports`}
            icon={ReportsIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.reports')}
          </NavItem>
          <NavItem
            to={`/${lang}/files`}
            icon={FilesIcon}
            onClick={onClose}
            isCollapsed={isCollapsed}
          >
            {t('navigation.files')}
          </NavItem>
        </div>
      </nav>

      <div
        className={`${
          isCollapsed ? 'p-2' : 'p-4'
        } border-t border-gray-700 transition-all duration-300`}
      >
        <NavItem
          to={`/${lang}/profile`}
          icon={ProfileIcon}
          onClick={onClose}
          isCollapsed={isCollapsed}
        >
          {t('navigation.profile')}
        </NavItem>
      </div>
    </div>
  );
};

export default Sidebar;
