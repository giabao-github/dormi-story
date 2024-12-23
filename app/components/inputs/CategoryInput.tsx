"use client";

import { ChangeEvent, useEffect } from 'react';
import { IconType } from 'react-icons';
import { GrUserWorker } from 'react-icons/gr';


interface CategoryInputProps {
  icon: IconType;
  label: string;
  example: string;
  selected?: boolean;
  type?: string;
  onClick: (value: string) => void;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  hasInputField?: boolean;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  icon: Icon,
  label,
  example,
  selected,
  type,
  onClick,
  onChange,
  value,
  hasInputField
}) => {

  const size = Icon === GrUserWorker ? 36 : 30;

  return (
    <>
      <div 
        onClick={() => onClick(label)}
        className={`rounded-xl border-2 p-4 flex flex-col gap-3 ${type === 'report' ? 'hover:border-button' : 'hover:border-primary'} transition cursor-pointer ${selected ? type === 'report' ? 'border-button border-[3px]' : 'border-primary border-[3px]' : 'border-neutral-300'}`}
      >
        <div className='flex flex-row items-center'>
          <Icon size={size} />
          <p className='ml-4 font-normal text-sm text-neutral-500'>{example}</p>
        </div>
        <div className='font-semibold'>
          {label}
        </div>
      </div>
      {hasInputField && label === 'Other' && (
        <input
          id='category-input'
          placeholder='Enter your category...'
          type='text'
          value={value}
          onChange={onChange}
          className={`w-full mt-4 px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}  
        />
      )}
    </>
  );
}

export default CategoryInput;