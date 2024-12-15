"use client";

import { IconType } from "react-icons";
import { GrUserWorker } from "react-icons/gr";


interface CategoryInputProps {
  icon: IconType;
  label: string;
  example: string;
  selected?: boolean;
  type?: string;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  icon: Icon,
  label,
  example,
  selected,
  type,
  onClick
}) => {

  const size = Icon === GrUserWorker ? 36 : 30;

  return (
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
  );
}

export default CategoryInput;