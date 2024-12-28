"use client";

import { SafeUser } from '@/app/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MessengerModal from './MessengerModal';
import ProfileInput from '../inputs/ProfileInput';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Avatar from '../Avatar';

interface ProfileModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser?: SafeUser | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    }
  });

  const image = watch('image');

  const sanitizeData = (data: FieldValues) => {
    const sanitizedData: FieldValues = {};
    Object.keys(data).forEach((key) => {
      sanitizedData[key] =
        typeof data[key] === 'string' ? data[key].replace(/\s+/g, ' ').trim() : data[key];
    });
    return sanitizedData;
  };

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const sanitizedData = sanitizeData(data);

    axios
      .post('/api/profile', sanitizedData)
      .then(() => {
        toast.remove();
        toast.success('Update profile successfully');
        onClose();
        router.refresh();
      })
      .catch((error) => {
        toast.remove();
        toast.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <MessengerModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <p className='text-2xl font-semibold text-gray-900'>
              Profile
            </p>
            <p className='mt-4 text-lg leading-6 text-gray-700'>
              Edit your profile
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <ProfileInput
                disabled={isLoading}
                label='Name'
                id='name'
                errors={errors}
                required
                register={register}
              />
              <div className=''>
                <label className='block mx-2 text-lg font-semibold leading-6 text-gray-900'>
                  Avatar
                </label>
                <div className='mt-2 mx-1 flex items-center gap-x-3'>
                  {currentUser?.image ? (
                    <Image
                      width={48}
                      height={48}
                      className='rounded-full aspect-square object-cover'
                      src={image
                        ? `${image}?c_crop,g_face,h_48,w_48`
                        : currentUser?.image
                      }
                      alt='Avatar'
                    />
                  ) : (
                    <Avatar user={currentUser} type='panel' />
                  )}
                  <CldUploadButton
                    options={{ 
                      maxFiles: 1, 
                      resourceType: 'image',
                      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
                    }}
                    onSuccess={handleUpload}
                    uploadPreset='dormistory'
                  >
                    <button
                      type='button'
                      disabled={isLoading}
                      className='py-1 px-3 mx-4 bg-primary hover:opacity-80 rounded-md select-none'
                    >
                      <span className='text-white text-sm font-semibold'>Change</span>
                    </button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <button
              type='button'
              disabled={isLoading}
              onClick={onClose}
              className='py-[6px] px-4 bg-neutral-200 hover:opacity-80 rounded-md select-none'
            >
              <span className='text-black text-base font-semibold'>Cancel</span>
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='py-[6px] px-5 mr-4 bg-primary hover:opacity-80 rounded-md select-none'
            >
              <span className='text-white text-base font-semibold'>Save</span>
            </button>
          </div>
        </div>
      </form>
    </MessengerModal>
  );
}

export default ProfileModal;