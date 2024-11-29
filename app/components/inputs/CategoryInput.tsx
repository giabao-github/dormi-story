"use client";

import { IconType } from "react-icons";

interface CategoryInputProps {
  icon: IconType;
  label: string;
  example: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  icon: Icon,
  label,
  example,
  selected,
  onClick
}) => {
  return (
    <div 
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-primary transition cursor-pointer ${selected ? 'border-primary border-4' : 'border-neutral-300'}`}
    >
      <div className='flex flex-row items-center'>
        <Icon size={30} />
        <p className='ml-4 font-normal text-sm text-neutral-500'>{example}</p>
      </div>
      <div className='font-semibold'>
        {label}
      </div>
    </div>
  );
}

export default CategoryInput;