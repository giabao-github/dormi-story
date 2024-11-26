"use client";

import Image from "next/image";
import { PiUserCircleDuotone } from "react-icons/pi";
import { SafeUser } from "../types";


interface AvatarProps {
  user: SafeUser | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
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
    return (
      <div className='bg-rose-500 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
        {getAbbreviation(user.name)}
      </div>
    );
  }
  else if (!user) {
    return (
      <PiUserCircleDuotone
        className='rounded-full'
        size={30}
      />
    );
  }
}

export default Avatar;