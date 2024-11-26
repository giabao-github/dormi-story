"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      priority
      alt='Logo'
      className='hidden md:block cursor-pointer opacity-100 rounded-full w-auto h-auto'
      height={80}
      width={80}
      src={'/images/logo.jpg'}
      onClick={() => router.push('/')}
    />
  );
}

export default Logo;