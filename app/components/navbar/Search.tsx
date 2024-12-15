"use client";

import qs from 'query-string';
import { FaFilter, FaSearch } from 'react-icons/fa';
import SearchInput from '../SearchInput';
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchModal from '@/app/hooks/useSearchModal';
import useSearchResult from '@/app/hooks/useSearchResult';
import { useCallback } from 'react';

const Search = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const searchResult = useSearchResult();
  const params = useSearchParams();

  const handleSearch = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      title: searchResult.title || '',
    };

    // Filter out empty values
    const filteredQuery = Object.fromEntries(
      Object.entries(updatedQuery).filter(([_, value]) => value != null && value !== '')
    );

    // Manually construct the query string in the desired order
    const orderedKeys = ['title', 'authorName', 'startDate', 'endDate', 'category'];
    const orderedQuery = orderedKeys
    .filter((key) => key in filteredQuery)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filteredQuery[key] as string)}`)
    .join("&");

    const url = `/articles?${orderedQuery}`;

    router.push(url);
  }, [router, searchResult.title, params]);

  return (
    <div className='w-full md:w-1/2 py-2 rounded-full hover:shadow-md hover:border transition cursor-pointer flex flex-row'>
      <SearchInput type='text' />
      <div className='flex flex-row items-center justify-between'>
        <div className='text-sm pr-5 text-gray-600 flex flex-row items-center gap-3'>
        <div
            title='Filters'
            onClick={searchModal.onOpen}
            className='p-3 bg-primary text-white rounded-full hover:scale-105'
          >
            <FaFilter size={24} />
          </div>
          <div
            title='Search'
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