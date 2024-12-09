"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoWarning } from 'react-icons/io5';
import { GiHammerBreak, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { RiSwordFill } from 'react-icons/ri';
import { FaHandcuffs, FaPills, FaEarDeaf } from 'react-icons/fa6';
import { MdCleaningServices } from 'react-icons/md';
import { SafeUser } from '@/app/types';
import Modal from './Modal'
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import useReportModal from '@/app/hooks/useReportModal'
import Input from '../inputs/Input';


enum STEPS {
  REPORTER = 0,
  CATEGORY = 1,
  DESCRIPTION = 2,
  PROOF = 3,
  CONFIRM = 4
}

export const categories = [
  {
    label: 'Room Cleanliness',
    icon: MdCleaningServices,
    example: 'Leaving messy room...',
    description: 'Violated conducts about room cleanliness' 
  },
  {
    label: 'Noise Pollution',
    icon: FaEarDeaf,
    example: 'Making loud or rude noise..',
    description: 'Violated conducts about noise pollution' 
  },
  {
    label: 'Violent Behaviors',
    icon: RiSwordFill,
    example: 'Fighting, bullying...',
    description: 'Violated conducts about violent behaviors' 
  },
  {
    label: 'Property Vandalization',
    icon: GiHammerBreak,
    example: 'Breaking furniture...',
    description: 'Violated conducts about property vandalization' 
  },
  {
    label: 'Addictive Substances',
    example: 'Smoking, drinking beers or alcohol...',
    icon: FaPills,
    description: 'Violated conducts about using addictive substances' 
  },
  {
    label: 'Social Evils',
    icon: FaHandcuffs,
    example: 'Using or selling drugs, gambling...',
    description: 'Violated conducts about social evils' 
  },
  {
    label: 'Other',
    icon: GiPerspectiveDiceSixFacesRandom,
    example: 'Other violated conducts',
    description: 'Other violated conducts' 
  },
]

interface ReportModalProps {
  currentUser?: SafeUser | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const reportModal = useReportModal();
  const [step, setStep] = useState(STEPS.REPORTER);
  const [label, setLabel] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [labelSelected, setLabelSelected] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      time: '',
      location: '',
      description: '',
      file: null,
      proofSrc: ''
    }
  });

  const category = watch('category');
  const description = watch('description');
  const time = watch('time');
  const location = watch('location');
  const proofSrc = watch('proofSrc');

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
      toast.error('Please select or enter a report category before proceeding');
      return;
    }
    else if (step === STEPS.DESCRIPTION && !time) {
      if (description) {
        setDescriptionError(false);
      }
      if (location) {
        setLocationError(false);
      }
      setTimeError(true);
      toast.remove();
      toast.error('Please provide the time when the issue happened');
      return;
    }
    else if (step === STEPS.DESCRIPTION && !location) {
      if (description) {
        setDescriptionError(false);
      }
      if (time) {
        setTimeError(false);
      }
      setLocationError(true);
      toast.remove();
      toast.error('Please provide the location where the issue happened');
      return;
    }
    else if (step === STEPS.DESCRIPTION && !description) {
      if (time) {
        setTimeError(false);
      }
      if (location) {
        setLocationError(false);
      }
      setDescriptionError(true);
      toast.remove();
      toast.error('Please describe the reported issue');
      return;
    }
    else if (step === STEPS.PROOF && proofSrc.length > 0 && !isValidUrl(proofSrc)) {
      setUrlError(true);
      toast.remove();
      toast.error('Cloud Service link must be a valid URL');
      return;
    }
    setCategoryError(false);
    setDescriptionError(false);
    setTimeError(false);
    setLocationError(false);
    setUrlError(false);
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONFIRM) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/report', data)
    .then(() => {
      toast.remove();
      toast.success('Report submitted');
      router.refresh();
      reset();
      setStep(STEPS.REPORTER);
      reportModal.onClose();
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
      return 'Report';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.REPORTER) {
      return undefined;
    }
    return 'Back';
  }, [step]);


  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title='Reporter Information'
          subtitle='To avoid report spammers, reporter information cannot be modified'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-2xl font-semibold w-1/4'>
          Student name
        </p>
        <div className='ml-8 w-2/3 py-3 px-6 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.name}
        </div>
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-2xl font-semibold w-1/4'>
          Student ID
        </p>
        <div className='ml-8 w-2/3 py-3 px-6 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.studentId}
        </div>
      </div>
    </div>
  );

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Behavior Category'
            subtitle='Choose a category that best fits the reported issue'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto mx-6'>
          {categories.map((item) => (
            <div key={item.label} className='col-span-1'>
              <CategoryInput
                onClick={(category) => {
                  setLabel(category);
                  setCustomValue('category', category === 'Other' ? labelInput : category);
                  if (category === 'Other') {
                    setLabelSelected(true);
                  } else {
                    setLabelSelected(false);
                  }
                }}
                selected={item.label === 'Other' && labelSelected ? true : category === item.label}
                label={item.label}
                example={item.example}
                icon={item.icon}
                type='report'
              />
            </div>
          ))}
          {label === 'Other' && (
            <input
            id='category-input'
            placeholder='Enter your category...'
            type='text'
            value={category}
            {...register('category')}
            onChange={(e) => {
              setLabel('Other');
              setLabelInput(e.target.value);
              setCustomValue('category', e.target.value);
            }}
            className={`w-full mt-6 h-1/2 px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['category'] || categoryError) && 'border-red-500 focus:border-red-500'}`}  
          />
          )}
        </div>
    </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Issue Description'
            subtitle='Describe the issue of rules violation'
          />
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='mx-6'>
            <Input
              id='time'
              label='Time'
              errors={errors}
              register={register}
              onChange={(e) => setCustomValue('time', e.target.value)}
              className={`${(errors['time'] || timeError) && 'border-red-500 focus:border-red-500'}`}
            />
          </div>
          <div className='mx-6'>
            <Input
              id='location'
              label='Location'
              errors={errors}
              register={register}
              onChange={(e) => setCustomValue('location', e.target.value)}
              className={`${(errors['location'] || locationError) && 'border-red-500 focus:border-red-500'}`}
            />
          </div>
          <textarea
            id='description'
            title=''
            placeholder='How did the incident take place? Where did it happen? Who were the associated students?...'
            className={`flex mx-6 text-base font-normal rounded-md bg-white border-2 border-border focus:border-neutral-800 px-3 py-3 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none ${(errors['description'] || descriptionError) && 'border-red-500 focus:border-red-500'}`}
            rows={5}
            value={description}
            {...register('description')}
            onChange={(e) => setCustomValue('description', e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PROOF) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Provide a Cloud Service link (optional)'
            subtitle='Remember to set permission to public'
          />
          <input
            id='proofSrc'
            placeholder='Google Drive, One Drive, Dropbox, Terabox...'
            type='text'
            value={proofSrc}
            {...register('proofSrc')}
            className={`w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['proofSrc'] || urlError) && 'border-red-500 focus:border-red-500'}`}  
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
            subtitle='Please carefully check your report information before submitting'
          />
          <div className='w-full py-3 px-5 text-lg font-semibold text-red-500 flex flex-row'>
            <IoWarning size={20} className='text-red-500 mr-2 mt-1' />
            <span>Note: any wrong reports will be addressed in accordance with VNU Dormitory Rules</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title='Report An Issue'
      isOpen={reportModal.isOpen}
      onClose={reportModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.REPORTER ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default ReportModal;