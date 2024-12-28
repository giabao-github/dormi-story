"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/app/types';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoWarning } from 'react-icons/io5';
import Modal from './Modal'
import Heading from '../Heading';
import useSurveyModal from '@/app/hooks/useSurveyModal';


enum STEPS {
  CREATOR = 0,
  CATEGORY = 1,
  TITLE = 2,
  LINK = 3,
  CONFIRM = 4
}

interface SurveyModalProps {
  currentUser?: SafeUser | null;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const surveyModal = useSurveyModal();
  const [step, setStep] = useState(STEPS.CREATOR);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [linkError, setLinkError] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      title: '',
      description: '',
      link: '',
    }
  });

  const category = watch('category');
  const title = watch('title');
  const description = watch('description');
  const link = watch('link');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,  
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const sanitizeData = (data: FieldValues) => {
    const sanitizedData: FieldValues = {};
    Object.keys(data).forEach((key) => {
      sanitizedData[key] =
        typeof data[key] === 'string' ? data[key].replace(/\s+/g, ' ').trim() : data[key];
    });
    return sanitizedData;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.trim());
      return true;
    } catch (e) {
      return false;
    }
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.CATEGORY && !category.trim()) {
      setCategoryError(true);
      toast.remove();
      toast.error('Please provide the survey category before proceeding');
      return;
    }
    else if (step === STEPS.TITLE && !title.trim()) {
      setTitleError(true);
      toast.remove();
      toast.error('Please provide the survey title before proceeding');
      return;
    }
    else if (step === STEPS.LINK && !link.trim()) {
      toast.remove();
      toast.error('Please provide the survey link before proceeding');
      setLinkError(true);
      return;
    }
    else if (step === STEPS.LINK && !isValidUrl(link)) {
      toast.remove();
      toast.error('Survey link must be a valid URL');
      setLinkError(true);
      return;
    }
    setCategoryError(false);
    setTitleError(false);
    setLinkError(false);
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONFIRM) {
      return onNext();
    }

    setIsLoading(true);

    const sanitizedData = sanitizeData(data);

    axios.post('/api/survey', sanitizedData)
      .then(() => {
        toast.remove();
        toast.success('Survey created');
        surveyModal.onClose();
        reset();
        setStep(STEPS.CREATOR);
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
        toast.error('An error occurred. Please try again');
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.CONFIRM) {
      return 'Create';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CREATOR) {
      return undefined;
    }
    return 'Back';
  }, [step]);


  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title='Survey Creator Information'
          subtitle='Creator information is linked to the corresponding account and cannot be modified'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Creator name
        </p>
        <div className='ml-8 w-2/3 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.name}
        </div>
      </div>
    </div>
  );

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Survey Category'
            subtitle='Enter a category that best fits your survey (Event Feedback, Technology Usage, Market Research, Customer Satisfaction, Shopping Behavior, Entertainment Preferences...)'
          />
        </div>
        <div className='flex flex-col gap-y-4 mx-6'>
          <input
            id='category'
            placeholder='Your survey category'
            type='text'
            value={category}
            {...register('category')}
            onChange={(e) => setCustomValue('category', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['category'] || categoryError) && 'border-red-500 focus:border-red-500'}`}  
          />
        </div>
    </div>
    );
  }

  if (step === STEPS.TITLE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Survey Title and Survey Description'
            subtitle='Provide your survey title and description'
          />
        </div>
        <div className='flex flex-col gap-y-8 mx-6'>
          <input
            id='title'
            placeholder='Your survey title'
            type='text'
            value={title} 
            {...register('title')}
            onChange={(e) => setCustomValue('title', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['title'] || titleError) && 'border-red-500 focus:border-red-500'}`}  
          />
          <input
            id='description'
            placeholder='Your survey description (optional)'
            type='text'
            value={description} 
            {...register('description')}
            onChange={(e) => setCustomValue('description', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}  
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.LINK) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Provide the survey link'
            subtitle='Remember to set permission to public'
          />
          <input
            id='link'
            placeholder='Google Forms, Jotform, Typeform, Paperform...'
            type='text'
            value={link}
            {...register('link')}
            onChange={(e) => setCustomValue('link', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['link'] || linkError) && 'border-red-500 focus:border-red-500'}`}  
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.CONFIRM) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Confirmation'
            subtitle='Please carefully check your survey information before creating'
          />
          <div className='w-full py-3 px-5 text-lg font-semibold text-red-500 flex flex-row'>
            <IoWarning size={20} className='text-red-500 mr-2 mt-1' />
            <span>Note: you might be responsible for any issues related to your survey</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title='Create A Survey'
      isOpen={surveyModal.isOpen}
      onClose={ surveyModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CREATOR ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default SurveyModal;