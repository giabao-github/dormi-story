"use client";

import useRequestsModal from '@/app/hooks/useRequestsModal';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { IoClose } from 'react-icons/io5';
import { FaCheck, FaXmark, FaUserXmark } from 'react-icons/fa6';
import { RiMessengerLine } from 'react-icons/ri';
import { SafeSentRequest, SafeReceivedRequest, SafeUser } from '@/app/types';
import Avatar from '../Avatar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import UnfriendModal from './UnfriendModal';


interface RequestsModalProps {
  sentRequests: SafeSentRequest[];
  receivedRequests: SafeReceivedRequest[];
  friendList: SafeUser[];
}

const FriendRequestsModal: React.FC<RequestsModalProps> = ({ 
  sentRequests, 
  receivedRequests,
  friendList
}) => {
  const router = useRouter();
  const currentPath = usePathname();
  const { isOpen, onClose } = useRequestsModal();
  const [activeTab, setActiveTab] = useState('received');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [requestId, setRequestId] = useState('');
  const memoSentRequests = useMemo(() => sentRequests, [sentRequests]);
  const memoReceivedRequests = useMemo(() => receivedRequests, [receivedRequests]);
  const memoFriendList = useMemo(() => friendList, [friendList]);


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

  const handleCancel = (id: string) => {
    setIsLoading(true);

    axios.delete('/api/friend/cancel', {
      data: { requestId: id },
    })
    .then(() => {
      toast.remove();
      toast.success('Friend request canceled');
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  };

  const handleMessageClick = useCallback((friend: SafeUser) => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      userId: friend.id
    })
    .then((response) => {
      onClose();
      const targetUrl = `/conversations/${response.data.id}`;
      if (currentPath !== targetUrl) {
        router.push(targetUrl);
      }
    })
    .finally(() => setIsLoading(false));  
  }, [router, onClose]);

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      case 'Pending':
      return 'text-yellow-600 bg-yellow-100';
    }
  };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     router.refresh();
  //   }, 500);
  
  //   return () => clearTimeout(timeout);
  // }, [memoSentRequests, memoReceivedRequests, memoFriendList]);


  if (!isOpen) {
    return null;
  }

  return (
    <>
      <UnfriendModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        requestId={requestId}
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 mx-4'>Friend Requests</h2>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='text-gray-400 hover:text-button disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none'
            >
              <span className='sr-only'>Close</span>
              <IoClose size={24} className='h-6 w-6' />
            </button>
          </div>

          <div className='mb-6'>
            <div className='flex border-b'>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'received'
                    ? 'border-b-2 border-secondary text-secondary'
                    : 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
                }`}
                onClick={() => setActiveTab('received')}
                disabled={isLoading}
              >
                <span className='font-semibold'>
                  Received Requests
                </span>
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'sent'
                    ? 'border-b-2 border-secondary text-secondary'
                    : 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
                }`}
                onClick={() => setActiveTab('sent')}
                disabled={isLoading}
              >
                <span className='font-semibold'>
                  Sent Requests
                </span>
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'friend'
                    ? 'border-b-2 border-secondary text-secondary'
                    : 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
                }`}
                onClick={() => setActiveTab('friend')}
                disabled={isLoading}
              >
                <span className='font-semibold'>
                  Your Friends
                </span>
              </button>
            </div>
          </div>

          <div className='min-h-96 overflow-y-auto'>
            {activeTab === 'received' ? (
              <div className='space-y-4'>
                {
                  receivedRequests.length === 0 ? 
                  <div className='flex items-center justify-center p-8 h-96'>
                    <p className='text-gray-500 text-lg py-10'>
                      You have no received friend requests
                    </p>
                  </div> :
                  receivedRequests.map((request) =>
                    (request.status === 'Pending' || request.status === 'Rejected') ? (
                    <div
                      key={request.id}
                      className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                    >
                      <div className='flex items-center space-x-4'>
                      <Avatar type='panel' user={request.sender} />
                        <div>
                          <h3 className='font-medium text-gray-800'>
                            {request.sender.name}
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className='flex space-x-4'>
                        <button
                          onClick={() => handleAccept(request.id)}
                          className='flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          disabled={isLoading}
                        >
                          <FaCheck className='mr-2' />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className='flex items-center px-4 py-2 bg-button text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          disabled={isLoading}
                        >
                          <FaXmark className='mr-2' />
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center p-8 h-96'>
                      <p className='text-gray-500 text-lg py-10'>
                        You have no received friend requests
                      </p>
                    </div>
                  ))
                }
              </div>
            ) : activeTab === 'sent' ? (
              <div className='space-y-4'>
                {
                  sentRequests.length === 0 ?
                  <div className='flex items-center justify-center h-96 p-8'>
                    <p className='text-gray-500 text-lg py-10'>
                      You have no sent friend requests
                    </p>
                  </div> :
                  sentRequests.map((request) => 
                    (request.status === 'Pending' || request.status === 'Rejected') ? (
                    <div
                      key={request.id}
                      className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                    >
                      <div className='flex items-center space-x-4'>
                        <Avatar type='panel' user={request.receiver} />
                        <div>
                          <h3 className='font-medium text-gray-800'>
                            {request.receiver.name}
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                      {request.status === 'Pending' && (
                          <button
                            onClick={() => handleCancel(request.id)}
                            className='flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            disabled={isLoading}
                          >
                            Cancel request
                          </button>
                      )}
                      {request.status === 'Rejected' && (
                        <button
                          onClick={() => handleCancel(request.id)}
                          className='flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          disabled={isLoading}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className='flex items-center justify-center h-96 p-8'>
                      <p className='text-gray-500 text-lg py-10'>
                        You have no sent friend requests
                      </p>
                    </div> 
                  ))
                }
              </div>
            ) : (
              <div className='space-y-4'>
                {
                  friendList.length === 0 ?
                  <div className='flex items-center justify-center h-96 p-8'>
                    <p className='text-gray-500 text-lg py-10'>
                      You have no friends
                    </p>
                  </div> :
                  friendList.map((friend) => (
                    <div
                      key={friend.id}
                      className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                    >
                      <div className='flex items-center space-x-4'>
                        <Avatar type='panel' user={friend} />
                        <div>
                          <h3 className='font-medium text-gray-800'>
                            {friend.name}
                          </h3>
                        </div>
                      </div>
                      <div className='flex space-x-4'>
                        <button
                          onClick={() => handleMessageClick(friend)}
                          className='flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          disabled={isLoading}
                        >
                          <RiMessengerLine className='mr-2' />
                          Message
                        </button>
                        <button
                          onClick={() => {
                            setConfirmOpen(true);
                            setRequestId(friend.id);
                          }}
                          className='flex items-center px-4 py-2 bg-button text-white font-medium rounded-md hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          disabled={isLoading}
                        >
                          <FaUserXmark className='mr-2' />
                          Unfriend
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendRequestsModal;
