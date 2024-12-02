"use client";

import Image from "next/image";
import { PiUserCircleDuotone } from "react-icons/pi";
import { SafeUser } from "../types";


interface AvatarProps {
  user: SafeUser | null | undefined;
  type?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, type }) => {
  const getAbbreviation = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  if (user && user.image) {
    return (
      <Image
        className='rounded-full'
        height={32}
        width={32}
        alt='User avatar'
        src={user.image}
      />
    );
  } else if (user && !user.image) {
    if (type === 'messenger') {
      return (
        <div className='relative'>
          <div className='bg-button h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-semibold select-none'>
            {getAbbreviation(user.name)}
          </div>
          <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-1 right-0 h-2 w-2 md:h-3 md:w-3' />
        </div>
      );
    }
    return (
      <div className='bg-button h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold select-none'>
        {getAbbreviation(user.name)}
      </div>
    );
  }
  else if (!user) {
    return (
      <PiUserCircleDuotone
        className='rounded-full'
        size={32}
      />
    );
  }
}

export default Avatar;