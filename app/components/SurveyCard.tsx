"use client";

import { SafeSurvey, SafeUser } from '@/app/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SurveyCardProps {
  data: SafeSurvey & { user: SafeUser };
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ data, onAction, disabled, actionLabel, actionId, currentUser }) => {
  const router = useRouter();

  return (
    <div className='col-span-1 flex justify-center'>
      <div className='flex flex-row items-center gap-2 w-[80%] p-2 border-2 border-primary rounded-md'>
        <div
          onClick={() => router.push('https://docs.google.com/forms')} 
          className='ml-2 aspect-[4/5] h-[90%] relative overflow-hidden rounded-xl'
        >
          <Image
            fill
            alt={data.title}
            src={'/images/google-forms.png'}
            className='object-cover h-full w-full cursor-pointer'
          />
        </div>
        <div className='flex flex-row justify-between items-center w-full mx-6'>
          <div className='flex flex-col gap-3'>
            <div 
              title={data.title}
              onClick={() => router.push(`${data.link}`)}
              className='font-bold text-2xl cursor-pointer hover:underline'
            >
              {data.title}
            </div>
            <div className='flex items-center flex-row gap-x-2 mx-2'>
              <span className='font-normal text-neutral-500 text-sm'>Created by: </span>
              <span className='font-semibold text-base'>{`${data.user.name}`}</span>
            </div>
            <div className='flex flex-row gap-x-4 font-normal text-sm text-neutral-500 mx-1'>
              <span>
                {`📅 ${new Date(data.createdAt).getDate().toString().padStart(2, '0')}/${
                  (new Date(data.createdAt).getMonth() + 1).toString().padStart(2, '0')
                }/${new Date(data.createdAt).getFullYear()}`}
              </span>
              <span>
                {`🕛 ${new Date(data.createdAt).getHours().toString().padStart(2, '0')
                }:${new Date(data.createdAt).getMinutes().toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyCard;