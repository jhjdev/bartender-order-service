import React from 'react';

interface AddNewButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

const AddNewButton: React.FC<AddNewButtonProps> = ({
  onClick,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center px-4 py-2 rounded-md
        bg-blue-600 text-white font-medium
        hover:bg-blue-700 focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:ring-offset-2
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {label}
    </button>
  );
};

export default AddNewButton;
