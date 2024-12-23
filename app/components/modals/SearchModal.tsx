"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useForm, FieldValues } from 'react-hook-form';
import useSearchModal from '@/app/hooks/useSearchModal';
import useSearchResult from '@/app/hooks/useSearchResult';
import Modal from './Modal';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import CategoryInput from '../inputs/CategoryInput';
import { categories as articleCategories } from './ArticleModal';
import { categories as reportCategories } from './ReportModal';


enum STEPS {
  AUTHOR = 0,
  DATE = 1,
  CATEGORY = 2
}

const SearchModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const searchModal = useSearchModal();
  const searchResult = useSearchResult();

  const isReportsPath = pathname === '/reports';
  const [step, setStep] = useState(isReportsPath ? STEPS.DATE : STEPS.AUTHOR);
  const [label, setLabel] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [labelSelected, setLabelSelected] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const initialStartDate = useRef<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
  const initialEndDate = useRef<Date>(new Date());
  const categories = isReportsPath ? reportCategories : articleCategories;

  const { register, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      category: '',
    }
  });

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,  
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onToggleCategory = useCallback((category: string) => {
    setCategoriesSelected((prev) => {
      let newCategories: string[];

      if (prev.includes(category)) {
        // Deselect the category
        newCategories = prev.filter((cat) => cat !== category);
      } else {
        // Select the category
        newCategories = [...prev, category];
      }

      // Handle 'Other' category independently
      if (category === 'Other') {
        setLabel(newCategories.includes('Other') ? 'Other' : '');
        setLabelSelected(newCategories.includes('Other'));
      }

      // Check if at least 1 category is selected but not all
      const isNoneSelected = newCategories.length === 0;
      const isAllSelected = newCategories.length === categories.length;
      const isPartialSelected = newCategories.length > 0 && newCategories.length < categories.length;

      // Only enable filter if the number of selected categories is neither 0 nor all
      if (isPartialSelected && !searchResult.filter) {
        searchResult.onFilter();
      } else if ((isNoneSelected || isAllSelected) && searchResult.filter) {
        searchResult.offFilter();
      }

      return newCategories;
    });
  }, [categories, searchResult]);
 
  const onSelectAllCategories = useCallback(() => {
    setCategoriesSelected((prev) => {
      let newCategories: string[];

      if (prev.length === categories.length) {
        newCategories = [];
        setLabel('');
        setLabelSelected(false);
      } else {
        newCategories = categories.map((item) => item.label);
        if (newCategories.includes('Other')) {
          setLabel('Other');
          setLabelSelected(true);
        } else {
          setLabel('');
          setLabelSelected(false);
        }
      }

      // Update filter state
      if (newCategories.length > 0 && newCategories.length < categories.length) {
        searchResult.onFilter();
      } else {
        searchResult.offFilter();
      }

      return newCategories;
    });
  }, [categories, searchResult]);
  

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.CATEGORY) {
      return onNext();
    }

    if (!pathname) {
      toast.remove();
      toast.error('Something went wrong. Trying to refresh the page');
      router.refresh();
      return;
    }

    // Check if filters are active
    const isAuthorFilterActive = authorName.trim().length > 0;
    const isDateFilterActive =
      startDate.getDate() !== initialStartDate.current.getDate() ||
      startDate.getMonth() !== initialStartDate.current.getMonth() ||
      startDate.getFullYear() !== initialStartDate.current.getFullYear() ||
      endDate.getDate() !== initialEndDate.current.getDate() ||
      endDate.getMonth() !== initialEndDate.current.getMonth() ||
      endDate.getFullYear() !== initialEndDate.current.getFullYear();

    const isCategoryFilterActive = category.trim().length > 0 || 
      (categoriesSelected.length > 0 && categoriesSelected.length < categories.length);

    // Update filter state
    if (isAuthorFilterActive || isDateFilterActive || isCategoryFilterActive) {
      searchResult.onFilter();
    } else {
      searchResult.offFilter();
    }

    // Prepare query parameters
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: Record<string, string | undefined> = {
      ...currentQuery,
      authorName: isAuthorFilterActive ? authorName.replace(/\s+/g, ' ').trim() : undefined,
      creator: isAuthorFilterActive && pathname !== '/articles' ? authorName.replace(/\s+/g, ' ').trim() : undefined,
      startDate: isDateFilterActive ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: isDateFilterActive ? format(endDate, 'yyyy-MM-dd') : undefined,
      category: pathname === '/surveys' || pathname === '/events'
      ? isCategoryFilterActive
        ? category
          .replace(/\s+/g, ' ')
          .trim()
          .split(',')
          .map((cat: string) => cat.trim().toLowerCase())
        : undefined
      : isCategoryFilterActive
        ? categoriesSelected.length === categories.length
          ? 'all' : 
          Array.from(
              new Set([
                ...categoriesSelected
                  .filter(cat => cat !== 'Other') 
                  .map(cat => cat.trim().toLowerCase()),
                ...(categoriesSelected.includes('Other') && labelInput
                  ? labelInput
                    .replace(/\s+/g, ' ')
                    .trim()
                    .split(',')
                    .map(cat => cat.trim().toLowerCase())
                  : []),
              ]),
            )
              .join(',')
        : categoriesSelected.length === categories.length
          ? 'all'
          : undefined,
    };

    // Filter out empty values
    const filteredQuery = Object.fromEntries(
      Object.entries(updatedQuery).filter(([_, value]) => value != null && value !== '')
    );

    // Dynamically select allowed keys based on the pathname
    const queryKeysByPathname: Record<string, string[]> = {
      '/articles': ['title', 'authorName', 'startDate', 'endDate', 'category'],
      '/reports': ['startDate', 'endDate', 'category'],
      '/events': ['title', 'creator', 'startDate', 'endDate', 'category'],
      '/surveys': ['title', 'creator', 'startDate', 'endDate', 'category'],
    };

    const allowedKeys = queryKeysByPathname[pathname] || [];
    const orderedQuery = allowedKeys
      .filter((key: string) => key in filteredQuery)
      .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(filteredQuery[key] as string)}`)
      .join("&");


    const url = `${pathname}?${orderedQuery}`;

    setStep(isReportsPath ? STEPS.DATE : STEPS.AUTHOR);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, router, searchResult, authorName, startDate, endDate, categoriesSelected, categories, articleCategories, category, labelInput, params, pathname, isReportsPath, onNext]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return 'Search';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === (isReportsPath ? STEPS.DATE : STEPS.AUTHOR)) {
      return undefined;
    }
    return 'Back';
  }, [step, isReportsPath]);

  useEffect(() => {
    if (params) {
      const currentQuery = qs.parse(params.toString());

      const hasAuthorFilter = pathname !== '/reports' && !!currentQuery.authorName;
      const hasDateFilter = currentQuery.startDate || currentQuery.endDate;
      const hasCategoryFilter = currentQuery.category && currentQuery.category !== 'all';

      if (hasAuthorFilter || hasDateFilter || hasCategoryFilter) {
        searchResult.onFilter();
      } else {
        searchResult.offFilter();
      }
    }
  }, [params, pathname, searchResult]);

  useEffect(() => {
    if (pathname !== '/reports') {
      setStep(STEPS.AUTHOR);
    } else {
      setStep(STEPS.DATE);
    }
  }, [pathname]);

  useEffect(() => {
    setLabel('');
    setLabelInput('');
    setLabelSelected(false);
    setCategoriesSelected([]);
    setAuthorName('');
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
    setEndDate(new Date());
    searchResult.offFilter();
  }, [pathname]);


  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title={`${pathname === '/articles' ? 'Filter: author name' : 'Filter: creator name'}`}
          subtitle={`${pathname === '/articles' ? 
            'Type the exact author name in the field below (case-insensitive)' : 
            'Type the exact creator name in the field below (case-insensitive)'}
          `}
        />
        <input
          id='author-name'
          placeholder={`${pathname === '/articles' ? 'Author name' : 'Creator name'}`}
          type='text'
          value={authorName}
          onChange={(event) => {
            const inputValue = event.target.value;
            setAuthorName(inputValue);
            if (inputValue.trim().length > 0) {
              searchResult.onFilter();
            } else {
              searchResult.offFilter();
            }
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
            subtitle='Select the estimated time range of your filtered results'
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
            subtitle='Select or enter the category of your filtered results'
          />
          {pathname !== '/surveys' && pathname !== '/events' && (
            <button
              onClick={onSelectAllCategories}
              className="mb-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
            >
              {categoriesSelected.length === categories.length ? 'Clear All' : 'Select All'}
            </button>
          )}
        </div>
        {pathname !== '/surveys' && pathname !== '/events' ? (
          <div className='overflow-y-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] mx-6'>
            {categories.map((item) => (
              <div key={item.label} className='col-span-1'>
                <CategoryInput
                  onClick={(category) => {
                    setCustomValue('category', category === 'Other' ? labelInput : category);
                    onToggleCategory(item.label);
                  }}
                  value={labelInput}
                  onChange={(e) => {
                    setLabelInput(e.target.value);
                  }}
                  hasInputField={label === 'Other'}
                  selected={item.label === 'Other' ? labelSelected : categoriesSelected.includes(item.label)}
                  label={item.label}
                  example={item.example}
                  icon={item.icon}
                />
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-y-4 mx-6'>
          <input
            id='category'
            placeholder={`${pathname === '/surveys' ? 'Your survey category' : 'Your event category'}`}
            type='text'
            value={category}
            {...register('category')}
            onChange={(e) => setCustomValue('category', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}  
          />
        </div>
        )}
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