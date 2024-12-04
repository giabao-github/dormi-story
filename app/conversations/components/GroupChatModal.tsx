"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/app/types';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import MessengerModal from '@/app/components/modals/MessengerModal';
import ProfileInput from '@/app/components/inputs/ProfileInput';
import Selector from '@/app/components/inputs/Selector';

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: SafeUser[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors} } = useForm<FieldValues>({
    defaultValues: {
      groupName: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
    .then(() => {
      onClose();
      toast.remove();
      toast.success(`Group ${data.groupName} created`);
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <p className='text-2xl font-semibold text-gray-900'>
              New group chat
            </p>
            <p className='mt-4 text-lg leading-6 text-gray-700'>
              At least 3 members including the group creator
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <ProfileInput
                disabled={isLoading}
                label='Group name'
                placeholder='Your group name'
                id='groupName'
                errors={errors}
                required
                register={register}
              />
              <Selector
                disabled={isLoading}
                label='Members (group creator will be automatically added)'
                options={users.map((user) => ({
                  value: user.id,
                  name: user.name,
                  email: user.email,
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true
                })}
                value={members}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          disabled={isLoading}
          onClick={onClose}
          className='py-2 px-3 bg-neutral-300 hover:opacity-80 rounded-md select-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <span className='text-gray-700 text-base font-semibold'>Cancel</span>
        </button>
        <button
          type='submit'
          disabled={isLoading || members.length < 2}
          className='py-2 px-3 bg-primary hover:opacity-80 rounded-md select-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <span className='text-white text-base font-semibold'>Create</span>
        </button>
        </div>
      </form>
    </MessengerModal>
  );
}

export default GroupChatModal;