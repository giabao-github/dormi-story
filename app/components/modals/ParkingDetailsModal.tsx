"use client";

import ImageModal from '@/app/conversations/[conversationId]/components/ImageModal';
import useParkingDetailsModal from '@/app/hooks/useParkingDetailsModal';
import React, { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

interface ParkingDetailsProps {
  parkingRequest: any;
}

const ParkingDetailsModal: React.FC<ParkingDetailsProps> = ({ parkingRequest }) => {
  const parkingDetailsModal = useParkingDetailsModal();
  const [licensePlateOpen, setLicensePlateOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'bill' | 'license' | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeModal === 'bill' && billOpen) {
          setBillOpen(false);
          setActiveModal(null);
        } else if (activeModal === 'license' && licensePlateOpen) {
          setLicensePlateOpen(false);
          setActiveModal(null);
        } else if (!activeModal && !billOpen && !licensePlateOpen) {
          parkingDetailsModal.onClose();
        }
      }
    };

    if (parkingDetailsModal.isOpen || billOpen || licensePlateOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [parkingDetailsModal.isOpen, billOpen, licensePlateOpen, activeModal]);


  useEffect(() => {
    console.log(activeModal)
    console.log(billOpen, licensePlateOpen)
  })
  if (!parkingDetailsModal.isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div 
        role='dialog'
        aria-modal='true'
        className='relative w-full max-w-2xl p-8 mx-4 bg-white rounded-lg shadow-xl'
      >
        <button
          onClick={() => parkingDetailsModal.onClose()}
          className='absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition-colors'
          aria-label='Close modal'
        >
          <FaXmark size={24} />
        </button>

        <div className='space-y-10'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Parking Spot Registration Details</h2>
          <div className='grid gap-6'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Student name:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.user.name}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Student ID:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.user.studentId}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Building:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.building.name}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Spot:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.spot}</span>
              </div>

              <div className='flex items-center'>
                <ImageModal
                  src={parkingRequest.licensePlateImage}
                  isOpen={licensePlateOpen}
                  onClose={() => {
                    setActiveModal(null);
                    setLicensePlateOpen(false);
                  }}
                  type='parking'
                />
                <span className='font-semibold w-48 text-gray-700'>License plate image:</span>
                {parkingRequest.licensePlateImage.length > 0 && (
                  <div
                  onClick={() => {
                    setActiveModal('license');
                    setLicensePlateOpen(true);
                  }}                  
                    className='text-primary font-semibold hover:underline cursor-pointer'
                  >
                    View license plate image
                  </div>
                )}
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Start date:</span>
                <span className='text-gray-600 font-medium'>
                  {
                    new Date(parkingRequest.startDate)
                    .toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                  }
                </span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>End date:</span>
                <span className='text-gray-600 font-medium'>
                  {
                    new Date(parkingRequest.endDate)
                    .toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                  }
                </span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Parking fee:</span>
                <span className='text-gray-600 font-medium'>{`${parkingRequest.price},000 VND`}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Payment method:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.bill ? 'Internet banking' : 'Cash'}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Payment status:</span>
                <span className='text-gray-600 font-medium'>{parkingRequest.paid ? 'Paid' : 'Unpaid'}</span>
              </div>

              {parkingRequest.bill && (
                <div className='flex items-center'>
                  <ImageModal
                    src={parkingRequest.bill}
                    isOpen={billOpen}
                    onClose={() => {
                      setActiveModal(null);
                      setBillOpen(false);
                    }}
                    type='parking'
                  />
                  <span className='font-semibold w-48 text-gray-700'>Transaction receipt:</span>
                    <div
                      onClick={() => {
                        setActiveModal('bill');
                        setBillOpen(true);
                      }}
                      className='text-primary font-semibold hover:underline cursor-pointer'
                    >
                      View transaction receipt
                    </div>
                </div>
              )}

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Registered date:</span>
                <span className='text-gray-600 font-medium'>
                  {
                    new Date(parkingRequest.registeredAt)
                    .toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                    + ' at ' + 
                    new Date(parkingRequest.registeredAt)
                      .toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: false
                      })
                  }
                </span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Expired date:</span>
                <span className='text-gray-600 font-medium'>
                {
                    new Date(parkingRequest.expiresAt)
                    .toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                    + ' at ' + 
                    new Date(parkingRequest.expiresAt)
                      .toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: false
                      })
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingDetailsModal;