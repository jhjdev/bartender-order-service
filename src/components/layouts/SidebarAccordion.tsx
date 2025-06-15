import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface SubLink {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarAccordionProps {
  title: string;
  icon: React.ReactNode;
  path?: string;
  subLinks?: SubLink[];
  isCollapsed?: boolean;
}

const SidebarAccordion: React.FC<SidebarAccordionProps> = ({
  title,
  icon,
  path,
  subLinks,
  isCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const content = (
    <div className="flex items-center space-x-3">
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="font-mono">{t(title)}</span>}
    </div>
  );

  return (
    <div className="accordion">
      {path ? (
        <NavLink
          to={path}
          className={({ isActive }) =>
            `accordion-header ${isActive ? 'nav-link active' : 'nav-link'}`
          }
        >
          {content}
        </NavLink>
      ) : (
        <button
          onClick={toggleAccordion}
          className="accordion-header w-full text-left"
        >
          {content}
          {!isCollapsed && (
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-auto text-french-gray"
            >
              ▼
            </motion.span>
          )}
        </button>
      )}

      {subLinks && !isCollapsed && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="accordion-content"
            >
              <div className="pl-4 space-y-2 py-2">
                {subLinks.map((subLink) => (
                  <NavLink
                    key={subLink.path}
                    to={subLink.path}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 rounded-md transition-colors duration-200 font-mono ${
                        isActive
                          ? 'bg-oxford-blue/20 text-peach'
                          : 'text-papaya-whip hover:text-peach'
                      }`
                    }
                  >
                    {subLink.icon && (
                      <span className="mr-2 text-xl">{subLink.icon}</span>
                    )}
                    {t(subLink.label)}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default SidebarAccordion;
