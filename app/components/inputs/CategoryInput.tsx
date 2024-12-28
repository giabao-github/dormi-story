"use client";

import { ChangeEvent } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons';
import { GrUserWorker } from 'react-icons/gr';


interface CategoryInputProps {
  id?: string;
  icon: IconType;
  label: string;
  hasInputField?: boolean;
  example: string;
  selected?: boolean;
  type?: string;
  value?: string;
  register?: UseFormRegister<FieldValues>;
  onClick: (value: string) => void;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  id,
  icon: Icon,
  label,
  hasInputField,
  example,
  selected,
  type,
  value,
  register,
  onClick,
  onChange,
  className
}) => {

  const size = Icon === GrUserWorker ? 36 : 30;

  return (
    <>
      <div 
        onClick={() => onClick(label)}
        className={`rounded-xl border-2 p-4 flex flex-col gap-3 ${(type === 'report' || type === 'article') ? 'hover:border-button' : 'hover:border-primary'} transition cursor-pointer ${selected ? (type === 'report' || type === 'article') ? 'border-button border-[3px]' : 'border-primary border-[3px]' : 'border-neutral-300'}`}
      >
        <div className='flex flex-row items-center'>
          <Icon size={size} />
          <p className='ml-4 font-normal text-sm text-neutral-500'>{example}</p>
        </div>
        <div className='font-semibold'>
          {label}
        </div>
      </div>
      {hasInputField && label === 'Other' && id && register && (
        <input
          id={id}
          placeholder='Enter your category...'
          type='text'
          value={value}
          {...register(id)}
          onChange={onChange}
          className={className}
        />
      )}
    </>
  );
}

export default CategoryInput;