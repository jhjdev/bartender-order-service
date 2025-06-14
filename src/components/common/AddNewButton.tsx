import * as React from 'react';

interface AddNewButtonProps {
  onClick: () => void;
  title?: string;
  children?: React.ReactNode;
}

const AddNewButton: React.FC<AddNewButtonProps> = ({
  onClick,
  title = 'Add new',
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="form-button form-button-primary flex items-center space-x-2"
      title={title}
      aria-label={title}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>{children || 'Add New'}</span>
    </button>
  );
};

export default AddNewButton;
