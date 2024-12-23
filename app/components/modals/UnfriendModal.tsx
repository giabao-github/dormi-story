"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';
import MessengerModal from '@/app/components/modals/MessengerModal';
import { DialogTitle } from '@headlessui/react';

interface UnfriendModalProps {
  isOpen?: boolean;
  onClose: () => void;
  requestId: string;
}

const UnfriendModal: React.FC<UnfriendModalProps> = ({ isOpen, onClose, requestId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnfriend = () => {
    setIsLoading(true);

    axios.delete('/api/friend/unfriend', {
      data: { requestId: requestId },
    })
    .then(() => {
      toast.remove();
      toast.success(`Unfriend successfully`);
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  }


  return (
    <MessengerModal
      isOpen={isOpen}
      onClose={onClose}
      disabled={isLoading}
    >
      <div className='sm:flex sm:items-start p-2'>
        <div className='mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-12 sm:w-12'>
          <FiAlertTriangle
            className='h-7 w-7 text-red-500'
          />
        </div>
        <div className='mt-3 text-center sm:ml-6 sm:mt-0 sm:text-left'>
          <DialogTitle
            as='h3'
            className='text-xl font-semibold leading-6 text-gray-900'
          >
            Unfriend
          </DialogTitle>
          <div className='mt-3 mr-6'>
            <p className='text-base text-gray-700'>
              Are you sure to unfriend this person? This action cannot be undone
            </p>
          </div>
        </div>
      </div>
      <div className='mt-6 mx-2 sm:flex sm:flex-row-reverse sm:justify-between'>
        <button
          type='button'
          disabled={isLoading}
          onClick={() => handleUnfriend()}
          className='py-2 px-3 bg-red-500 hover:opacity-80 rounded-md select-none disabled:opacity-50'
        >
          <span className='text-white text-base font-semibold'>Unfriend</span>
        </button>
        <button
          type='button'
          disabled={isLoading}
          onClick={onClose}
          className='py-2 px-3 bg-primary hover:opacity-80 rounded-md select-none disabled:opacity-50'
        >
          <span className='text-white text-base font-semibold'>Cancel</span>
        </button>
      </div>
    </MessengerModal>
  );
}

export default UnfriendModal;