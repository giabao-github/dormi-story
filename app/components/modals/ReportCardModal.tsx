"use client";

import useReportCardModal from '@/app/hooks/useReportCardModal';
import React, { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';


const ReportCardModal = () => {
  const reportCardModal = useReportCardModal();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        reportCardModal.onClose();
      }
    };

    if (reportCardModal.isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [reportCardModal.isOpen, reportCardModal.onClose]);

  if (!reportCardModal.isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div 
        role='dialog'
        aria-modal='true'
        className='relative w-full max-w-2xl p-8 mx-4 bg-white rounded-lg shadow-xl'
      >
        <button
          onClick={reportCardModal.onClose}
          className='absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition-colors'
          aria-label='Close modal'
        >
          <FaXmark size={24} />
        </button>

        <div className='space-y-10'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Report Details</h2>
          <div className='grid gap-6'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Reporter name:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.name}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Reporter student ID:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.studentId}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Reported date:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.createdAt}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Category:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.category}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Time:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.time}</span>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Location:</span>
                <span className='text-gray-600 font-medium'>{reportCardModal.location}</span>
              </div>

              <div className='flex flex-col'>
                <span className='font-semibold text-gray-700 mb-2'>Description:</span>
                <p className='text-gray-600 bg-gray-100 border p-4 rounded-lg'>{reportCardModal.description}</p>
              </div>

              <div className='flex items-center'>
                <span className='font-semibold w-48 text-gray-700'>Media:</span>
                {reportCardModal.mediaLink.length > 0 && (
                  <a 
                    href={reportCardModal.mediaLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary font-semibold hover:underline'
                  >
                    View media
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportCardModal;