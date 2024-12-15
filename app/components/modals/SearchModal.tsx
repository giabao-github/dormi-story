"use client";

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import useSearchModal from '@/app/hooks/useSearchModal';
import Modal from './Modal';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import { categories } from './ArticleModal';
import CategoryInput from '../inputs/CategoryInput';
import useSearchResult from '@/app/hooks/useSearchResult';

enum STEPS {
  AUTHOR = 0,
  DATE = 1,
  CATEGORY = 2
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();
  const searchResult = useSearchResult();

  const [step, setStep] = useState(STEPS.AUTHOR);
  const [authorName, setAuthorName] = useState('');
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, [authorName, startDate, endDate]);

  const onToggleCategory = useCallback((category: string) => {
    setCategoriesSelected((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  const onSelectAllCategories = useCallback(() => {
    if (categoriesSelected.length === categories.length) {
      setCategoriesSelected([]);
    } else {
      setCategoriesSelected(categories.map((item) => item.label));
    }
  }, [categoriesSelected]);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.CATEGORY) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      title: searchResult.title || '',
      authorName,
      startDate: startDate ? formatISO(startDate) : undefined,
      endDate: endDate ? formatISO(endDate) : undefined,
      category: categoriesSelected.length === categories.length ? 'all' : categoriesSelected.join(',')
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

    setStep(STEPS.AUTHOR);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, router, searchResult.title, authorName, startDate, endDate, categoriesSelected, categories, params, onNext]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return 'Search';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.AUTHOR) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title='Filter: author name'
          subtitle='Type the exact author name in the field below (case-insensitive)'
        />
        <input
          id='author-name'
          placeholder='Your searched author name'
          type='text'
          value={authorName}
          onChange={(event) => {
            const inputValue = event.target.value;
            setAuthorName(inputValue);
          }}
          className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}  
        />
      </div>
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Filter: time range'
            subtitle='Select the estimated time range of your search result'
          />
          <div className='flex flex-row gap-x-4'>
            <div className='flex flex-col justify-start gap-x-2 w-1/2'>
              <h3 className='text-lg text-center font-medium mb-2'>From</h3>
              <Calendar
                value={startDate}
                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 5))}
                onChange={(date) => {
                  setStartDate(date);
                  if (endDate && date > endDate) {
                    setEndDate(date);
                  }
                }}
              />
            </div>
            <div className='flex flex-col justify-start gap-x-2 w-1/2'>
              <h3 className='text-lg text-center font-medium mb-2'>To</h3>
              <Calendar
                value={endDate}
                minDate={startDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Filter: category'
            subtitle='Select the category of your search result'
          />
          <button
            onClick={onSelectAllCategories}
            className="mb-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
          >
            {categoriesSelected.length === categories.length ? 'Clear All' : 'Select All'}
          </button>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh]'>
            {categories.map((item) => (
              <div key={item.label} className='col-span-1'>
                <CategoryInput
                  onClick={() => onToggleCategory(item.label)}
                  selected={categoriesSelected.includes(item.label)}
                  label={item.label}
                  example={item.example}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title='Filters'
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.AUTHOR ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default SearchModal;