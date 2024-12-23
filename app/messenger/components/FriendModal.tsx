"use client";

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa6';
import { SafeReceivedRequest, SafeSentRequest, SafeUser } from '@/app/types';
import MessengerModal from '@/app/components/modals/MessengerModal';
import ProfileInput from '@/app/components/inputs/ProfileInput';
import FetchedUserCard from './FetchedUserCard';


interface FriendModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: SafeUser;
  sentRequests: SafeSentRequest[];
  receivedRequests: SafeReceivedRequest[];
  friendList: SafeUser[];
  users: SafeUser[];
}

const FriendModal: React.FC<FriendModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  sentRequests, 
  receivedRequests,
  friendList, 
  users 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [label, setLabel] = useState('');
  const [requestId, setRequestId] = useState('');
  const [matchedEmail, setMatchedEmail] = useState(false);
  const [searchedUser, setSearchedUser] = useState<SafeUser | undefined>(undefined);

  const { register, handleSubmit, watch, formState: { errors} } = useForm<FieldValues>({
    defaultValues: {
      receiverEmail: '',
      receiverToken: ''
    }
  });

  const receiverEmail = watch('receiverEmail');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (receiverEmail.toLowerCase() === currentUser.email?.toLowerCase()) {
      toast.remove();
      toast.error('You cannot send a friend request to yourself');
      setIsLoading(false);
      return;
    }

    axios.post('/api/friend/send', {
      receiverId: searchedUser?.id,
    })
    .then(() => {
      toast.remove();
      toast.success('Friend request sent');
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  };

  const handleAccept = (id: string) => {
    setIsLoading(true);

    axios.post('/api/friend/accept', {
      requestId: id,
    })
    .then(() => {
      toast.remove();
      toast.success('Friend request accepted');
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  };

  const handleReject = (id: string) => {
    setIsLoading(true);

    axios.delete('/api/friend/reject', {
      data: { requestId: id },
    })
    .then(() => {
      toast.remove();
      toast.success('Friend request rejected');
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const displayLabel = () => {
      const currentId = searchedUser?.id;
      const hasSent = sentRequests.find((request) => request.receiverId === currentId);
      const isPending = receivedRequests.find((request) => request.senderId === currentId);
      const isFriend = friendList.length > 0 && friendList.find((friend) => friend.id === currentId);
      console.log('pending: ', sentRequests)
      if (isFriend) {
        setLabel('Friend');
        setIsFriend(true);
      } else if (isPending) {
        console.log('pending request')
        setLabel('Accept');
        setIsPending(true);
        setRequestId(isPending.id);
      } else if (hasSent) {
        setLabel('Request sent');
        setHasSent(true);
      } else {
        setLabel('Add friend');
        setHasSent(false);
        setIsFriend(false);
        setIsPending(false);
      }
    }
    displayLabel();
  }, [searchedUser, sentRequests]);

  useEffect(() => {
    const matchedEmail = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    const matchedUser = users.find((user) => user.email?.toLowerCase() === email.toLowerCase() && user.messengerSecretToken === token);
    setSearchedUser(matchedUser);
    setMatchedEmail(!!matchedEmail);
  }, [email, token]);

  return (
    <MessengerModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <p className='text-2xl font-semibold text-gray-900'>
              Add a friend
            </p>
            <p className='mt-4 text-lg leading-6 text-gray-700'>
              Search for a person you want to send a friend request
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <ProfileInput
                disabled={isLoading}
                label='Email'
                type='email'
                placeholder='name@domain.com'
                id='receiverEmail'
                errors={errors}
                required
                register={register}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
              />
              <ProfileInput
                disabled={isLoading}
                label='Messenger token'
                type='text'
                placeholder='Messenger token should contain 20 characters'
                id='receiverToken'
                errors={errors}
                required
                register={register}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setToken(event.target.value);
                }}
              />
              <div className='flex flex-col gap-y-4'>
                {isValidEmail(email) && token && (
                  <FetchedUserCard user={searchedUser} matchedEmail={matchedEmail} currentUser={currentUser} />
                )}
                {searchedUser && isPending && !isFriend && (
                  <p className='mx-4 text-lg font-semibold text-gray-700'>
                    {`${searchedUser?.name} has sent you a friend request`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          disabled={isLoading}
          onClick={onClose}
          className='py-2 px-4 bg-neutral-300 hover:opacity-80 rounded-md select-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <span className='text-gray-700 text-base font-semibold'>Cancel</span>
        </button>
        <button
          type={label === 'Accept' ? 'button' : 'submit'}
          onClick={() => {
            if (label === 'Accept') {
              handleAccept(requestId);
            }
          }}
          disabled={isLoading || !searchedUser || !currentUser || hasSent || isFriend}
          className='py-2 px-4 bg-primary hover:opacity-80 rounded-md select-none disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {
            label === 'Friend' ?
            <span className='text-white text-base font-semibold flex justify-center items-center flex-row gap-x-2'>
              {label}
              <FaCheck size={18} className='mb-[1px]' />
            </span> : 
            <span className='text-white text-base font-semibold'>
              {label}
            </span>
          }
        </button>
        {isPending && !isFriend && (
          <button
          type='button'
          disabled={isLoading}
          onClick={() => handleReject(requestId)}
          className='py-2 px-4 bg-button hover:opacity-80 rounded-md select-none disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <span className='text-white text-base font-semibold'>
              Reject
            </span>
          </button>
        )}
        </div>
      </form>
    </MessengerModal>
  );
}

export default FriendModal;