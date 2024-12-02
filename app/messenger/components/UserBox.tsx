"use client";

import Avatar from '@/app/components/Avatar';
import { SafeUser } from '@/app/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface UserBoxProps {
  data: SafeUser;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      userId: data.id
    })
    .then((data) => {
      router.push(`/conversations/${data.data.id}`);
    })
    .finally(() => setIsLoading(false));  
  }, [data, router]);

  return (
    <div
      onClick={handleClick}
      className='w-full h-24 flex items-center space-x-3 py-3 px-6 hover:bg-neutral-100 transition cursor-pointer'
    >
      <Avatar user={data} type='messenger' />
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center ml-2 mb-1'>
            <p className='text-lg font-semibold text-gray-900'>
              {data.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserBox;