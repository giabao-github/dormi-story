"use client";

import MessengerModal from '@/app/components/modals/MessengerModal';
import useConversation from '@/app/hooks/useConversation';
import { DialogTitle } from '@headlessui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/conversations/${conversationId}`)
    .then(() => {
      onClose();
      toast.remove();
      toast.success('Conversation deleted');
      router.refresh();
    })
    .catch(() => {
      toast.remove();
      toast.error('Failed to delete conversation');
    })
    .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);


  return (
    <MessengerModal
      isOpen={isOpen}
      onClose={onClose}
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
            Delete conversation
          </DialogTitle>
          <div className='mt-3 mr-6'>
            <p className='text-base text-gray-700'>
              Are you sure to permanently delete this chat? This action cannot be undone
            </p>
          </div>
        </div>
      </div>
      <div className='mt-6 mx-2 sm:flex sm:flex-row-reverse sm:justify-between'>
        <button
          type='button'
          disabled={isLoading}
          onClick={onDelete}
          className='py-2 px-3 bg-red-500 hover:opacity-80 rounded-md select-none disabled:opacity-50'
        >
          <span className='text-white text-base font-semibold'>Delete</span>
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

export default ConfirmModal;