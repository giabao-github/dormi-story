import React, { forwardRef, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { IoCloseCircle } from "react-icons/io5";
import useSearchResult from '../hooks/useSearchResult';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  paragraph?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ className, disabled, paragraph = false, type, ...props }, ref) => {
  const [value, setValue] = useState('');
  const router = useRouter();
  const searchResult = useSearchResult();

  const clearInput = () => {
    setValue('');
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete('title');
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const titleParam = urlParams.get('title');
    if (titleParam) {
      setValue(titleParam);
      searchResult.setTitle(titleParam);
    }
  }, []);

  if (paragraph) {
    return (
      <textarea
        className={twMerge(`flex w-full rounded-md bg-neutral-100 border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none`, className)}
        disabled={disabled}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        rows={5}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
  else {
    return (
      <div className='relative flex items-center w-full mx-4'>
        <title>{`Dormistory | ${value.length > 0 ? value : 'Home Page'}`}</title>
        <input
          className={twMerge(`flex flex-row justify-between items-center w-full rounded-full px-5 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-100 border border-neutral-400`, className)}
          disabled={disabled}
          type={type}
          value={value}
          placeholder='Search for articles, events, surveys...'
          onChange={(e) => {
            setValue(e.target.value);
            searchResult.setTitle(e.target.value);
          }}
          ref={ref as React.Ref<HTMLInputElement>}
          {...props}
        />
        {value && (
          <button
            type='button'
            title='Clear input'
            className="absolute right-3 text-neutral-700 hover:text-neutral-500"
            onClick={clearInput}
            >
            <IoCloseCircle size={20} />
          </button>
        )}
      </div>
    );
  }
})

SearchInput.displayName = 'SearchInput';

export default SearchInput;
