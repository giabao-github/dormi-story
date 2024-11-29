"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoWarning } from 'react-icons/io5';
import { GiHammerBreak, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { RiSwordFill } from 'react-icons/ri';
import { FaHandcuffs, FaPills, FaTrashCan } from 'react-icons/fa6';
import { SafeUser } from '@/app/types';
import Modal from './Modal'
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import useReportModal from '@/app/hooks/useReportModal'
import UploadInput from '../inputs/UploadInput';
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
    label: 'Violent Behaviors',
    icon: RiSwordFill,
    example: 'Fighting, using weapons...',
    description: 'Violated conducts about violent behaviors' 
  },
  {
    label: 'Property Sabotage',
    icon: GiHammerBreak,
    example: 'Breaking furniture...',
    description: 'Violated conducts about property sabotage' 
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
    example: 'Using or selling drugs...',
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const time = watch('time');
  const location = watch('location');
  const description = watch('description');
  const proofSrc = watch('proofSrc');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,  
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    if (step === STEPS.CATEGORY && !category) {
      toast.remove();
      toast.error('Please select a category before proceeding');
      return;
    }
    if (step === STEPS.DESCRIPTION && !description) {
      toast.remove();
      toast.error('Please describe the issue');
      return;
    }
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
      toast.remove();
      toast.error(error);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCustomValue('proofSrc', file);
    }
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
        <div className='w-2/3 py-3 px-6 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
          {currentUser?.name}
        </div>
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-2xl font-semibold w-1/4'>
          Student ID
        </p>
        <div className='w-2/3 py-3 px-6 text-lg font-semibold text-neutral-700 border-2 border-neutral-700 rounded-md'>
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
                  setCustomValue('category', category);
                }}
                selected={category === item.label}
                label={item.label}
                example={item.example}
                icon={item.icon}
              />
            </div>
          ))}
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
              required
            />
          </div>
          <div className='mx-6'>
            <Input
              id='location'
              label='Location'
              errors={errors}
              register={register}
              required
            />
          </div>
          <textarea
            id='description'
            title=''
            placeholder='How did the incident take place? Where did it happen? Who were the associated students?...'
            className='flex mx-6 text-base font-normal rounded-md bg-white border-2 border-neutral-300 focus:border-neutral-800 px-3 py-3 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none'
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
            title='Upload the proof if there is one file (optional)'
            subtitle='Accepted file formats: image, audio, video'
          />
          <div className={`border-primary border-2 p-4 rounded-lg flex items-center justify-center ${selectedFile ? 'border-solid flex-row' : 'border-dashed flex-col'}`}>
            <UploadInput
              className='hidden'
              id='proofSrc'
              type='file'
              {...register('proofSrc')}
              accept='image/*,audio/*,video/*'
              onChange={handleFileChange}
            />
            <label htmlFor='proofSrc' className={`w-full bg-primary/30 cursor-pointer text-black px-2 py-2 rounded-lg flex items-center justify-center font-semibold ${selectedFile ? 'text-lg' : 'text-xl'}`}>
              {selectedFile ? `${selectedFile.name.substring(0, 40)}${selectedFile.name.length > 40 ? '...' : ''}` : 'Choose File'}
            </label>
            {selectedFile && (
              <button
                title='Remove uploaded file'
                type='button'
                onClick={() => setSelectedFile(null)}
                className='inline-flex items-center w-[5%] ml-3 text-red-500 border border-red-500 px-2 py-2 rounded-lg'
              >
                <FaTrashCan />
              </button>
            )}
          </div>
          <div className='mt-14 mb-12 flex flex-row items-center justify-center'>
            <div className='flex-grow h-px bg-neutral-300'></div>
            <span className='mx-3 text-neutral-500'>OR</span>
            <div className='flex-grow h-px bg-neutral-300'></div>
          </div>
          <Heading
            title='Provide a Cloud Service link if there are multiple files (optional)'
            subtitle='Remember to set permission to public'
          />
          <input
            id='proofSrc'
            placeholder='Google Drive, One Drive, Dropbox, Terabox...'
            type='text'
            value={proofSrc}
            {...register('proofSrc')}
            className={`peer w-full px-4 py-3 font-medium border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}  
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
            subtitle='Please carefully check your report information before reporting'
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