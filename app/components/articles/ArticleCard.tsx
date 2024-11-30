"use client";

import { SafeArticle, SafeUser } from '@/app/types';
import { Article } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HeartButton from '../HeartButton';

interface ArticleCardProps {
  data: SafeArticle;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ data, onAction, disabled, actionLabel, actionId, currentUser }) => {
  const router = useRouter();

  return (
    <div className='col-span-1'>
      <div className='flex flex-row items-center gap-2 w-2/3 p-2 border-2 border-primary rounded-md'>
        <div className='aspect-square w-1/12 relative overflow-hidden rounded-xl'>
          <Image
            fill
            alt={data.title}
            src={data.files}
            className='object-cover h-full w-full hover:scale-110 transition cursor-pointer'
          />
        </div>
        <div className='flex flex-row justify-between items-center w-full mx-6'>
          <div className='flex flex-col gap-2'>
            <div 
              title={data.title}
              onClick={() => router.push(`/articles/${data.id}`)}
              className='font-bold text-2xl cursor-pointer hover:underline'
            >
              {data.title}
            </div>
            <div className='font-semibold text-base'>
              {data.author}
            </div>
            <div className='font-normal text-sm text-neutral-500'>
              {`${new Date(data.createdAt).getDate().toString().padStart(2, '0')}/${
                (new Date(data.createdAt).getMonth() + 1).toString().padStart(2, '0')
              }/${new Date(data.createdAt).getFullYear()} - ${
                new Date(data.createdAt).getHours().toString().padStart(2, '0')
              }:${new Date(data.createdAt).getMinutes().toString().padStart(2, '0')}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;