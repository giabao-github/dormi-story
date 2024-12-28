"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SafeUser } from '@/app/types';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal'
import Heading from '../Heading';
import useBuildingModal from '@/app/hooks/useBuildingModal';


interface BuildingModalProps {
  currentUser?: SafeUser | null;
}

const BuildingModal: React.FC<BuildingModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const buildingModal = useBuildingModal();
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [capacityError, setCapacityError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      capacity: '',
      price: '',
    }
  });

  const name = watch('name');
  const capacity = watch('capacity');
  const price = watch('price');

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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const numericCapacity = Number(data.capacity.replace(/\s+/g, ' ').trim());
    const numericPrice = Number(data.price.replace(/\s+/g, ' ').trim());

    if (!name.trim()) {
      setNameError(true);
      toast.remove();
      toast.error('Please provide the building name before proceeding');
      return;
    } else if (isNaN(numericCapacity) || numericCapacity <= 0) {
      setCapacityError(true);
      toast.remove();
      toast.error('Please provide the parking lot capacity before proceeding');
      return;
    } else if (isNaN(numericPrice) || numericPrice <= 0) {
      setPriceError(true);
      toast.remove();
      toast.error('Please provide the parking lot price before proceeding');
      return;
    }
    setNameError(false);
    setCapacityError(false);
    setPriceError(false);

    setIsLoading(true);

    const sanitizedData = sanitizeData(data);
    sanitizedData.capacity = numericCapacity;
    sanitizedData.price = numericPrice;

    console.log(sanitizedData)
    axios.post('/api/building', sanitizedData)
    .then(() => {
      toast.remove();
      toast.success('Building created');
      router.refresh();
      reset();
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


  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <div className='mx-6'>
        <Heading
          title='Building Information'
          subtitle='Provide the building and parking lot information to create'
        />
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Building name
        </p>
        <div className='flex flex-col gap-y-4'>
          <input
            id='building-name'
            placeholder='Building name'
            type='text'
            value={name}
            {...register('name')}
            onChange={(e) => setCustomValue('name', e.target.value)}
            className={`ml-10 w-3/4 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['name'] || nameError) && 'border-red-500 focus:border-red-500'}`}  
          />
        </div>
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Capacity
        </p>
        <div className='flex flex-col gap-y-4'>
          <input
            id='capacity'
            placeholder='Capacity'
            type='text'
            value={capacity}
            {...register('capacity')}
            onChange={(e) => setCustomValue('capacity', e.target.value.replace(/[^0-9]/g, ''))}
            className={`ml-10 w-3/4 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['capacity'] || capacityError) && 'border-red-500 focus:border-red-500'}`}  
          />
        </div>
      </div>
      <div className='flex flex-row items-center mx-6'>
        <p className='text-xl font-semibold w-1/4 px-2'>
          Price
        </p>
        <div className='flex flex-col gap-y-4'>
          <input
            id='price'
            placeholder='Price per slot'
            type='text'
            value={price}
            {...register('price')}
            onChange={(e) => setCustomValue('price', e.target.value.replace(/[^0-9]/g, ''))}
            className={`ml-10 w-3/4 py-2 px-4 text-lg font-semibold text-neutral-700 border-2 border-border focus:border-black rounded-md outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${(errors['price'] || priceError) && 'border-red-500 focus:border-red-500'}`}  
          />
        </div> 
      </div>
    </div>
  );


  return (
    <Modal
      title='Create A Building'
      isOpen={buildingModal.isOpen}
      onClose={ buildingModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      actionLabel='Create'
      body={bodyContent}
    />
  );
}

export default BuildingModal;