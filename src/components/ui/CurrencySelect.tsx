import React from 'react';
import Select, { StylesConfig, GroupBase } from 'react-select';
import { supportedCurrencies } from '../../../backend/types/settings';

interface CurrencyOption {
  value: string;
  label: string;
  symbol: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const customStyles: StylesConfig<
  CurrencyOption,
  false,
  GroupBase<CurrencyOption>
> = {
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2C3E50'
      : state.isFocused
      ? '#34495E'
      : 'white',
    color: state.isSelected ? 'white' : '#2C3E50',
    '&:hover': {
      backgroundColor: '#34495E',
      color: 'white',
    },
  }),
  control: (provided) => ({
    ...provided,
    borderColor: '#2C3E50',
    '&:hover': {
      borderColor: '#34495E',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#2C3E50',
  }),
};

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  label,
  error,
  className = '',
  disabled = false,
}) => {
  const options: CurrencyOption[] = supportedCurrencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`,
    symbol: currency.symbol,
  }));

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Select
        value={selectedOption}
        onChange={(option) => onChange(option?.value || 'USD')}
        options={options}
        isDisabled={disabled}
        className={`${error ? 'border-red-500' : ''} ${className}`}
        classNamePrefix="select"
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        placeholder="Select currency"
        aria-label={label || 'Select currency'}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
