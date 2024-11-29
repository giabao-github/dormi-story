"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { IconType } from 'react-icons';
import qs from 'query-string';

interface CategorySectionProps {
  icon: IconType;
  label: string;
  selected?: boolean;
} 

const CategorySection: React.FC<CategorySectionProps> = ({ icon: Icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    }

    const url = `/${encodeURIComponent(label.toLowerCase())}`;

    router.push(url);
  }, [label, params, router]);


  return (
    <div 
      onClick={handleClick}
      className={`flex flex-row items-center justify-start w-full my-1 gap-2 py-3 ${label === 'Behavior Points' ? 'px-[26px]' : 'px-7'} hover:text-neutral-800 hover:bg-primary/30 transition cursor-pointer ${selected ? 'border-l-4 border-l-primary text-neutral-800 bg-primary/30' : 'border-transparent text-neutral-500'}`}
    >
      <Icon size={label === 'Behavior Points' ? 24 : 20} />
      <div className='font-medium text-sm pl-1'>{label}</div>
    </div>
  );
}

export default CategorySection;