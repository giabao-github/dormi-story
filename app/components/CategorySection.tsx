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

    const url = `?${qs.stringify(updatedQuery, { skipNull: true })}`;

    router.push(url);
  }, [label, params, router]);


  return (
    <div 
      onClick={handleClick}
      className={`flex flex-row items-center justify-start w-full my-1 gap-2 py-3 ${label === 'Articles' ? 'px-8' : 'px-7'} hover:text-neutral-800 hover:bg-rose-200 transition cursor-pointer ${selected ? 'border-l-4 border-l-rose-400 text-neutral-800 bg-rose-200' : 'border-transparent text-neutral-500'}`}
    >
      <Icon size={label === 'Articles' ? 14 : 20} />
      <div className='font-medium text-sm pl-1'>{label}</div>
    </div>
  );
}

export default CategorySection;