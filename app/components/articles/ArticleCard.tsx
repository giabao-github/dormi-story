"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BiNews } from 'react-icons/bi';
import { SafeArticle, SafeUser } from '@/app/types';

interface ArticleCardProps {
  data: SafeArticle & { user: SafeUser };
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ data, onAction, disabled, actionLabel, actionId, currentUser }) => {
  const router = useRouter();

  return (
    <div className='col-span-1 flex justify-center'>
      <div 
        onClick={() => router.push(`/articles/${data.id}`)}
        className='flex flex-row items-center gap-2 w-[80%] p-2 border shadow-sm hover:shadow-md rounded-md cursor-pointer'
      >
        <div className='ml-2 aspect-square w-[10%] relative overflow-hidden rounded-xl'>
          {data.files ? (
            <Image
              fill
              alt={data.title}
              src={data.files}
              className='object-cover h-full w-full hover:scale-110 transition cursor-pointer'
            />
          ) : (
            <div className='flex justify-center items-center object-cover h-full w-full hover:scale-110 transition cursor-pointer'>
              <BiNews size={80} />
            </div>
          )}
        </div>
        <div className='flex flex-row justify-between items-center w-full mx-6'>
          <div className='flex flex-col gap-3'>
            <div 
              title={data.title}
              onClick={() => router.push(`/articles/${data.id}`)}
              className='font-bold text-2xl cursor-pointer hover:underline'
            >
              {data.title}
            </div>
            <div className='flex items-center flex-row gap-x-2 mx-2'>
              <span className='font-normal text-neutral-500 text-sm'>Posted by: </span>
              <span className='font-semibold text-base'>{`${data.user.name}`}</span>
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
              <span>
                {`🏷️ ${data.category}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;