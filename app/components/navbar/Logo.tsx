"use client";

import { SafeUser } from '@/app/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LogoProps {
  currentUser?: SafeUser | null; 
}

const Logo: React.FC<LogoProps> = ({ currentUser }) => {
  const router = useRouter();

  return (
    <Image
      priority
      alt='Logo'
      className='hidden md:block cursor-pointer opacity-100 rounded-full w-auto h-auto select-none'
      height={80}
      width={80}
      src={'/images/logo.jpg'}
      onClick={() => {
        router.push('/');
      }}
    />
  );
}

export default Logo;