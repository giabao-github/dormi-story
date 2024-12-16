"use client";

import { SafeReport, SafeUser } from '@/app/types';
import Image from 'next/image';
import useReportCardModal from '../hooks/useReportCardModal';

interface ReportCardProps {
  data: SafeReport;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ReportCard: React.FC<ReportCardProps> = ({ data, onAction, disabled, actionLabel, actionId, currentUser }) => {
  const reportCardModal = useReportCardModal();
  const createdAt = `${new Date(data.createdAt).getDate().toString().padStart(2, '0')}/${
    (new Date(data.createdAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.createdAt).getFullYear()} at ${new Date(data.createdAt).getHours().toString().padStart(2, '0')}:${new Date(data.createdAt).getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className='flex justify-center'>
      <div 
        onClick={() => {
          reportCardModal.setReportDetails(data.reporterName, data.reporterStudentId, createdAt, data.category, data.time, data.location, data.description, data.proofSrc);
          reportCardModal.onOpen();
        }}
        className='flex flex-row items-center gap-2 w-[94%] p-2 border shadow-sm rounded-md cursor-pointer hover:shadow-md'
      >
        <div className='ml-2 aspect-square h-[90%] relative overflow-hidden rounded-xl'>
          <Image
            fill
            alt={'Report Image Placeholder'}
            src={'/images/google-forms.png'}
            className='object-cover'
          />
        </div>
        <div className='flex flex-row justify-between items-center w-full mx-6'>
          <div className='flex flex-col gap-3'>
            <div 
              title={data.category}
              className='font-bold 2xl:text-2xl xl:text-xl lg:text-lg sm:text-base'
            >
              {data.category}
            </div>
            <div className='flex items-center flex-row gap-x-2 mx-2'>
              <span className='font-normal text-neutral-500 text-sm'>Reported by: </span>
              <span className='font-semibold text-base sm:text-sm'>{`${data.reporterName}`}</span>
            </div>
            <div className='flex flex-row gap-x-4 font-normal text-sm text-neutral-500 mx-1'>
              <span>
                {`📅 ${new Date(data.createdAt).getDate().toString().padStart(2, '0')}/${
                  (new Date(data.createdAt).getMonth() + 1).toString().padStart(2, '0')
                }/${new Date(data.createdAt).getFullYear()}`}
              </span>
              <span>
                {`🕒 ${new Date(data.createdAt).getHours().toString().padStart(2, '0')
                }:${new Date(data.createdAt).getMinutes().toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;