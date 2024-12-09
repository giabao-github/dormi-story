"use client";

import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';


interface IntroductionPageProps {
  currentUser?: SafeUser | null;
}

const IntroductionPage: React.FC<IntroductionPageProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const is404Page = (
    pathname !== '/' && 
    pathname !== '/articles' && 
    !pathname?.includes('/articles/') &&
    pathname !== '/messenger' &&
    pathname !== '/conversations' &&
    !pathname?.includes('/conversations/') &&
    pathname !== '/surveys' &&
    pathname !== '/rules'
  );

  if (!is404Page && !currentUser) {
    return (
      <div className='absolute bottom-0 sm:h-[calc(100vh-99px)] md:h-[calc(100vh-130px)] w-full'>
        <img
          src={'/images/VNU-dorm.jpg'}
          alt='VNU Dormitory'
          className='object-cover aspect-auto absolute bottom-0'
        />
      </div>
    );
  }
}

export default IntroductionPage;