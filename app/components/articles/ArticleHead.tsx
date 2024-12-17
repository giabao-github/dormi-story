"use client";

import { SafeUser } from '@/app/types';
import Avatar from '../Avatar';
import { IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';

interface ArticleHeadProps {
  title: string;
  time: string;
  category: string;
  author: SafeUser;
  id: string;
  currentUser?: SafeUser | null;
}

const ArticleHead: React.FC<ArticleHeadProps> = ({ title, time, author, category, id, currentUser }) => {
  const formattedDate = `${new Date(time).getDate().toString().padStart(2, '0')}/${
    (new Date(time).getMonth() + 1).toString().padStart(2, '0')
    }/${new Date(time).getFullYear()}`;
  const formattedTime = `${new Date(time).getHours().toString().padStart(2, '0')}:${
    new Date(time).getMinutes().toString().padStart(2, '0')}`;

  return (
    <>
      <div className='mb-6 text-start'>
        <div className='text-4xl font-bold leading-normal'>
          {title}
        </div>
        <div className='mt-12 flex flex-row items-center gap-x-12'>
          <div className='text-lg font-semibold flex flex-row items-center gap-3'>
            <Avatar user={author} />
            <div>{author.name}</div>
          </div>
          <div className='flex flex-row gap-2 font-normal text-neutral-500'>
            {`📅 ${formattedDate}`}
          </div>
          <div className='flex flex-row gap-2 font-normal text-neutral-500'>
            {`🕒 ${formattedTime}`}
          </div>
          <div className='flex flex-row gap-2 font-normal text-neutral-500'>
            {`🏷️ ${category}`}
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleHead;