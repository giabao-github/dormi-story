"use client";

import React from 'react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '../../types';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoWarning } from 'react-icons/io5';
import Modal from './Modal'
import Heading from '../Heading';
import useEventModal from '../../hooks/useEventModal';



enum STEPS {
  CREATOR = 0,
  CATEGORY = 1,
  TITLE = 2,
  LINK = 3,
  CONFIRM = 4
}

interface EventModalProps {
  currentUser?: SafeUser | null;
}

const EventModal: React.FC<EventModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const eventModal = useEventModal();
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
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    if (step === STEPS.CATEGORY && !category) {
      setCategoryError(true);
      toast.remove();
      toast.error('Please provide an event category before proceeding');
      return;
    }
    else if (step === STEPS.TITLE && !title) {
      setTitleError(true);
      toast.remove();
      toast.error('Please provide an event title before proceeding');
      return;
    }
    else if (step === STEPS.LINK && !link) {
      toast.remove();
      toast.error('Please provide an event link before proceeding');
      setLinkError(true);
      return;
    }
    else if (step === STEPS.LINK && !isValidUrl(link)) {
      toast.remove();
      toast.error('Event link must be a valid URL');
      setLinkError(true);
      return;
    }
    setCategoryError(false);
    setTitleError(false);
    setLinkError(false);
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONFIRM) {
      return onNext();
    }

    setIsLoading(true);
    console.log(data)
    axios.post('/api/event', data)
    .then(() => {
      toast.remove();
      toast.success('Event created');
      eventModal.onClose();
      router.refresh();
      reset();
      setStep(STEPS.CREATOR);
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
      return 'Complete';
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
          title='Event Creator Information'
          subtitle='Creator information is linked to the corresponding account and cannot be modified'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='2xl:text-2xl xl:text-xl font-semibold w-1/4'>
          Creator name
        </p>
        <div className='ml-8 w-2/3 py-3 px-6 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
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
            title='Event Category'
            subtitle='Enter a category that best fits your event (Academic Events, Career and Networking Events, Cultural Events, Social Events, Sports and Fitness Events, Recreational Events...)'
          />
        </div>
        <div className='flex flex-col gap-y-4 mx-6'>
          <input
            id='category'
            placeholder='Your event category'
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
            title='Event Title and Event Description'
            subtitle='Provide your event title and description'
          />
        </div>
        <div className='flex flex-col gap-y-8 mx-6'>
          <input
            id='title'
            placeholder='Your event title'
            type='text'
            value={title} 
            {...register('title')}
            onChange={(e) => setCustomValue('title', e.target.value)}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['title'] || titleError) && 'border-red-500 focus:border-red-500'}`}  
          />
          <input
            id='description'
            placeholder='Your event description (optional)'
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
            title='Provide the event link'
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
            subtitle='Please carefully check your event information before creating'
          />
          <div className='w-full py-3 px-5 text-lg font-semibold text-red-500 flex flex-row'>
            <IoWarning size={20} className='text-red-500 mr-2 mt-1' />
            <span>Note: you might be responsible for any issues related to your event</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title='Plan An Event'
      isOpen={eventModal.isOpen}
      onClose={ eventModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CREATOR ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default EventModal;