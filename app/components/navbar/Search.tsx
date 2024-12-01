"use client";

import { FaSearch } from 'react-icons/fa';
import SearchInput from '../SearchInput';
import { useRouter } from 'next/navigation';
import useSearchResult from '@/app/hooks/useSearchResult';

const Search = () => {
  const searchResult = useSearchResult();
  const router = useRouter();

  const handleSearch = () => {
    const basePath = '/search';
    const params = new URLSearchParams();

    if (searchResult.value.trim() === '') {
      params.delete('title');
    } else {
      params.set('title', searchResult.value);
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className='w-full md:w-1/2 py-2 rounded-full hover:shadow-md hover:border transition cursor-pointer flex flex-row'>
      <SearchInput type='text' />
      <div className='flex flex-row items-center justify-between'>
        <div className='text-sm pr-5 text-gray-600 flex flex-row items-center gap-3'>
          <div
            onClick={handleSearch}
            className='p-3 bg-primary text-white rounded-full hover:scale-105'
          >
            <FaSearch size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;