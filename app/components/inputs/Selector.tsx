import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';

interface SelectorProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  label,
  value,
  onChange,
  options,
  disabled
}) => {
  return (
    <div className='z-[60]'>
      <label className='block text-lg leading-6 mx-2 font-semibold text-gray-900'>
        {label}
      </label>
      <div className='mt-2 mx-1'>
        <ReactSelect
          isDisabled={disabled}
          placeholder='Search friends'
          noOptionsMessage={() => 'No members to invite'}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          formatOptionLabel={(option, { context }) =>
            context === 'menu' ? (
              // Show user email in the dropdown menu
              <span>{option.email}</span>
            ) : (
              // Show user name in the input field
              <span>{option.name}</span>
            )
          }
          styles={{
            placeholder: (base) => ({
              ...base,
              fontSize: '16px',
              color: 'rgb(163, 163, 163, 1)'
            }),
            control: (base, state) => ({
              ...base,
              borderWidth: '2px',
              borderRadius: '6px',
              borderColor: state.isFocused ? 'rgba(30, 181, 137, 0.7)' : 'rgb(229, 229, 229, 1)',
              boxShadow: state.isFocused ? '0 0 0 1px rgba(30, 181, 137, 0.7)' : undefined,
              padding: '2px 2px',
              fontWeight: '400',
              '&:hover': {
                borderColor: state.isFocused ? 'rgba(30, 181, 137, 0.7)' : 'rgb(163, 163, 163, 1)',
              },
            }),
            noOptionsMessage: (base) => ({
              ...base,
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 70,
              borderColor: '#1EB589'
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: 'rgba(30, 181, 137, 0.7)',
              borderRadius: '6px'
            }),
            multiValueRemove: (base) => ({
              ...base,
              backgroundColor: 'rgba(30, 181, 137, 0.1)',
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px',
              ":hover": {
                color: '#FFF'
              }
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#000'
            }),
            indicatorsContainer: (base) => ({
              ...base,
              cursor: 'pointer'
            }),
            option: (base) => ({
              ...base,
              cursor: 'pointer'
            }),
            clearIndicator: (base) => ({
              ...base,
              '&:hover': {
                color: '#FF6B6B'
              }
            }),
            dropdownIndicator: (base) => ({
              ...base,
              '&:hover': {
                color: '#1EB589'
              }
            }),
          }}
          classNames={{
            control: () => 'text-sm',
          }}
        />
      </div>
    </div>
  );
}

export default Selector;