"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/app/types';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoWarning } from 'react-icons/io5';
import { HiAcademicCap } from 'react-icons/hi2';
import { FaVolleyball, FaPeopleRobbery } from 'react-icons/fa6';
import { GrUserWorker, GrTechnology } from 'react-icons/gr';
import { MdAutoStories } from 'react-icons/md';
import { MdForest } from 'react-icons/md';
import { GiCardRandom } from 'react-icons/gi';
import Modal from './Modal'
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import Input from '../inputs/Input';
import useArticleModal from '@/app/hooks/useArticleModal';
import ResourceUpload from '../inputs/ResourceUpload';


enum STEPS {
  AUTHOR = 0,
  CATEGORY = 1,
  TITLE = 2,
  RESOURCES = 3,
  CONTENT = 4,
  OUTRO = 5,
  CONFIRM = 6
}

export const categories = [
  {
    label: 'Educational Resources',
    icon: HiAcademicCap,
    example: 'Study tips, learning tools, scholarships and grants...',
    description: 'Articles about educational resources' 
  },
  {
    label: 'Extracurricular Activities',
    icon: FaVolleyball,
    example: 'Sport tournaments, camping trips, community service...',
    description: 'Articles about extracurricular activities' 
  },
  {
    label: 'Student Life',
    example: 'Time management tips, friendship building...',
    icon: FaPeopleRobbery,
    description: 'Articles about student life' 
  },
  {
    label: 'Career Guidance',
    icon: GrUserWorker,
    example: 'Entrepreneurship for students, preparing for job interviews...',
    description: 'Articles about career guidance' 
  },
  {
    label: 'Technology and Trends',
    icon: GrTechnology,
    example: 'Social media use, AI and future career...',
    description: 'Articles about technology and trends' 
  },
  {
    label: 'Inspirational Stories',
    icon: MdAutoStories,
    example: 'Student success stories, overcoming challenges...',
    description: 'Articles about inspirational stories' 
  },
  {
    label: 'Weathers and environment',
    icon: MdForest,
    example: 'Environmental campaign...',
    description: 'Articles about weathers and environment'
  }, 
  {
    label: 'Other',
    icon: GiCardRandom,
    example: 'Other article categories...',
    description: 'Articles about other categories'
  }
]

interface ArticleModalProps {
  currentUser?: SafeUser | null;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const articleModal = useArticleModal();
  const [step, setStep] = useState(STEPS.AUTHOR);
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      title: '',
      introduction: '',
      content: '',
      files: '',
      tags: '',
      sources: ''
    }
  });

  const category = watch('category');
  const title = watch('title');
  const intro = watch('introduction');
  const content = watch('content');
  const resources = watch('files');

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
      toast.error('Please select an article category before proceeding');
      return;
    }
    else if (step === STEPS.TITLE && !title) {
      setInputError(true);
      toast.remove();
      toast.error('Please provide an article title before proceeding');
      return;
    }
    else if (step === STEPS.CONTENT && !content) {
      setInputError(true);
      toast.remove();
      toast.error('Please write an article content before proceeding');
      return;
    }
    setInputError(false);
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONFIRM) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/article', data)
    .then(() => {
      toast.remove();
      toast.success('Article posted');
      articleModal.onClose();
      router.refresh();
      reset();
      setStep(STEPS.AUTHOR);
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
      return 'Post';
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
          title='Author Information'
          subtitle='Author information is linked to the corresponding account and cannot be modified'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-2xl font-semibold w-1/4'>
          Author name
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
            title='Articles Category'
            subtitle='Choose a category that best fits your article'
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

  if (step === STEPS.TITLE) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Article Title and Introductory Text'
            subtitle='Provide your article title and introductory text (lead paragraph)'
          />
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='mx-6'>
            <Input
              id='title'
              label='Title'
              errors={errors}
              register={register} 
              onChange={(e) => setCustomValue('title', e.target.value)}
              required={false}
              inputError={inputError}
            />
          </div>
          <textarea
            id='introduction'
            title=''
            placeholder='Provide an overview or additional context for your article (optional)'
            className='flex mx-6 text-base font-normal rounded-md bg-white border-2 border-neutral-300 focus:border-neutral-800 px-3 py-3 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none'
            rows={5}
            value={intro}
            {...register('introduction')}
            onChange={(e) => setCustomValue('introduction', e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.RESOURCES) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Upload the resource included in your article (optional)'
            subtitle='Accepted file formats: image, video'
          />
          <ResourceUpload
            value={resources}
            onChange={(value) => setCustomValue('files', value)}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.CONTENT) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Article Content'
            subtitle='For sub-heading, follow this template: [###Sub-heading]'
          />
        </div>
        <div className='flex flex-col gap-y-4'>
          <textarea
            id='content'
            title=''
            placeholder='Write your article in details'
            className={`flex mx-6 text-base font-normal rounded-md bg-white border-2 border-neutral-300 focus:border-neutral-800 px-3 py-3 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none ${inputError ? 'border-red-500 focus:border-red-500' : 'border-neutral-300'}`}
            rows={15}
            value={content}
            {...register('content')}
            onChange={(e) => setCustomValue('content', e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.OUTRO) {
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <div className='mx-6'>
          <Heading
            title='Article Sources and Tags'
            subtitle='Add sources and tags to your article'
          />
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='mx-6'>
            <Input
              id='sources'
              label='Sources'
              errors={errors}
              register={register}
            />
          </div>
          <div className='mx-6'>
            <Input
              id='tags'
              label='Tags'
              errors={errors}
              register={register}
            />
          </div>
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
            subtitle='Please carefully check your article information before posting'
          />
          <div className='w-full py-3 px-5 text-lg font-semibold text-red-500 flex flex-row'>
            <IoWarning size={20} className='text-red-500 mr-2 mt-1' />
            <span>Note: you might be responsible for any issues related to your article</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title='Post An Article'
      isOpen={articleModal.isOpen}
      onClose={ articleModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.AUTHOR ? undefined : onBack}
      body={bodyContent}
    />
  );
}

export default ArticleModal;