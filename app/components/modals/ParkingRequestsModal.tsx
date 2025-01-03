"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { IoClose } from 'react-icons/io5';
import { FaCircleCheck, FaCircleInfo, FaCircleXmark } from 'react-icons/fa6';
import Avatar from '../Avatar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useParkingRequestsModal from '@/app/hooks/useParkingRequestsModal';
import ParkingDetailsModal from './ParkingDetailsModal';
import useParkingDetailsModal from '@/app/hooks/useParkingDetailsModal';


const ParkingRequestsModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useParkingRequestsModal();
  const [activeTab, setActiveTab] = useState('pending');
  const parkingDetailsModal = useParkingDetailsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [parkingRequests, setParkingRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);

  const handleAccept = (id: string, buildingId: string, userId: string) => {
    setIsLoading(true);

    axios.post('/api/parking-spot/accept', {
      spotId: id,
      buildingId,
      userId
    })
    .then(() => {
      toast.remove();
      toast.success('Parking request accepted');
      router.refresh();
    })
    .catch((error) => {
      console.log(error);
      toast.remove();
      toast.error('An unexpected error occurred');   
    })
    .finally(() => setIsLoading(false));
  };

  const handleReject = (id: string, buildingId: string) => {
    setIsLoading(true);

    axios.post('/api/parking-spot/reject', {
      spotId: id, 
      buildingId
    })
    .then(() => {
      toast.remove();
      toast.success('Parking request rejected');
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
    let intervalId: NodeJS.Timeout;
    const fetchRequests = async () => {
      const response = await axios.post('/api/refresh')
      setParkingRequests(response.data.parkingRequests);
      setApprovedRequests(response.data.approvedRequests);
    }
    if (isOpen) {
      fetchRequests();
      intervalId = setInterval(fetchRequests, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post('/api/refresh')
      setParkingRequests(response.data.parkingRequests);
      setApprovedRequests(response.data.approvedRequests);
    }
    fetchData();
  }, []);


  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl'>
        <div className='flex items-center justify-between mb-12'>
          <h2 className='text-2xl font-bold text-gray-800 mx-4'>Parking Requests List</h2>
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
                activeTab === 'pending'
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
              }`}
              onClick={() => setActiveTab('pending')}
              disabled={isLoading}
            >
              <span className='font-semibold'>
                Pending Requests
              </span>
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'approved'
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'text-gray-500 hover:text-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
              }`}
              onClick={() => setActiveTab('approved')}
              disabled={isLoading}
            >
              <span className='font-semibold'>
                Approved Requests
              </span>
            </button>
          </div>
        </div>

        <div className='min-h-96 overflow-y-auto'>
          {activeTab === 'pending' ? (
            <div className='space-y-4 mx-4'>
              {parkingRequests.length <= 0 ? 
                <div className='flex items-center justify-center p-8 h-96'>
                  <p className='text-gray-500 text-lg py-10'>
                    There are no parking requests at the moment
                  </p>
                </div> :
                parkingRequests.map((request) => (
                  <div
                    key={request.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                  >
                    <ParkingDetailsModal parkingRequest={selectedRequest} />
                    <div className='flex items-center space-x-4'>
                      <Avatar type='panel' user={request.user} />
                      <div>
                        <h3 className='font-medium text-gray-800'>
                          {request.user.name}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {`Registered ${formatDistanceToNow(new Date(request.registeredAt), { addSuffix: true })}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-6'>
                      <button
                        title='Details'
                        onClick={() => {
                          setSelectedRequest(request);
                          parkingDetailsModal.onOpen();
                        }}
                        disabled={isLoading}
                        className='transition-colors focus:outline-none hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaCircleInfo size={30} className='text-secondary' />
                      </button>
                      <button
                        title='Approve'
                        onClick={() => handleAccept(request.id, request.buildingId, request.userId)}
                        disabled={isLoading}
                        className='transition-colors focus:outline-none hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaCircleCheck size={30} className='text-primary' />
                      </button>
                      <button
                        title='Reject'
                        onClick={() => handleReject(request.id, request.buildingId)}
                        disabled={isLoading}
                        className='transition-colors focus:outline-none hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaCircleXmark size={30} className='text-button' />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className='space-y-4 mx-4'>
              {approvedRequests.length <= 0 ? 
                <div className='flex items-center justify-center p-8 h-96'>
                  <p className='text-gray-500 text-lg py-10'>
                    There are no approved parking requests
                  </p>
                </div> :
                approvedRequests
                .filter(
                  (request) =>
                    request.id && request.userId && request.buildingId &&
                    request.month && request.startDate && request.endDate &&
                    request.spot && request.status &&
                    request.price && request.paid &&
                    request.user && request.building &&
                    request.createdAt && request.expiresAt &&
                    (request.registeredAt || request.updatedAt)
                )
                .map((request) => (
                  <div
                    key={request.id}
                    className='flex items-center justify-between p-4 rounded-lg bg-gray-50'
                  >
                    <ParkingDetailsModal parkingRequest={request} />
                    <div className='flex items-center space-x-4'>
                      <Avatar type='panel' user={request.user} />
                      <div>
                        <h3 className='font-medium text-gray-800'>
                          {request.user.name}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {`Approved ${formatDistanceToNow(new Date(request.updatedAt || request.registeredAt), { addSuffix: true })}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-6'>
                      <button
                        title='Details'
                        onClick={() => parkingDetailsModal.onOpen()}
                        disabled={isLoading}
                        className='transition-colors focus:outline-none hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaCircleInfo size={30} className='text-secondary' />
                      </button>
                      <button
                        title='Reject'
                        onClick={() => handleReject(request.id, request.buildingId)}
                        disabled={isLoading}
                        className='transition-colors focus:outline-none hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaCircleXmark size={30} className='text-button' />
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
  );
};

export default ParkingRequestsModal;
