"use client";

import Image from 'next/image';
import { PiUserCircleDuotone } from 'react-icons/pi';
import { SafeUser } from '../types';
import useActiveList from '../hooks/useActiveList';


interface AvatarProps {
  user: SafeUser | null | undefined;
  type?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, type }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  const getAbbreviation = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  if (user && user.image) {
    if (type === 'messenger') {
      return (
        <div className='relative'>
          <Image
            className='rounded-full'
            height={64}
            width={64}
            alt={user.name}
            src={user.image}
          />
          {isActive && (
            <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-1 right-0 h-2 w-2 md:h-3 md:w-3' />
          )}
        </div>
      );
    } else if (type === 'panel') {
      return (
        <div className='relative'>
          <Image
            className='rounded-full'
            height={48}
            width={48}
            alt={user.name}
            src={user.image}
          />
          {isActive && (
            <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-1 right-0 h-1 w-1 md:h-2 md:w-2' />
          )}
        </div>
      );
    }
    return (
      <Image
        className='rounded-full'
        height={32}
        width={32}
        alt={user.name}
        src={user.image}
      />
    );
  } else if (user && !user.image) {
    if (type === 'messenger') {
      return (
        <div className='relative'>
          <div className='bg-button 2xl:h-16 2xl:w-16 xl:h-12 xl:w-12 rounded-full flex items-center justify-center text-white 2xl:text-2xl xl:text-xl font-semibold select-none'>
            {getAbbreviation(user.name)}
          </div>
          {isActive && (
            <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-1 right-0 h-2 w-2 md:h-3 md:w-3' />
          )}
        </div>
      );
    }
    else if (type === 'panel') {
      return (
        <div className='relative'>
          <div className='bg-button h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-semibold select-none'>
            {getAbbreviation(user.name)}
          </div>
          {isActive && (
            <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-1 right-0 h-1 w-1 md:h-2 md:w-2' />
          )}
        </div>
      );
    }
    return (
      <div className='bg-button h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold select-none'>
        {getAbbreviation(user.name)}
      </div>
    );
  }
  else if (!user?.name) {
    return (
      <PiUserCircleDuotone
        className='rounded-full'
        size={64}
      />
    );
  }
}

export default Avatar;