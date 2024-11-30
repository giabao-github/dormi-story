"use client";

import { IconType } from "react-icons";
import { FaPeopleRobbery, FaVolleyball } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { HiAcademicCap } from "react-icons/hi";
import { MdForest } from "react-icons/md";

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

  const size = Icon === GrUserWorker ? 36 : 30;

  return (
    <div 
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-primary transition cursor-pointer ${selected ? 'border-primary border-4' : 'border-neutral-300'}`}
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