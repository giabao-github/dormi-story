"use client";

import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';
import Categories from './Categories';


interface SidebarProps {
  currentUser?: SafeUser | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const is404Page = (
    pathname !== '/' && 
    pathname !== '/articles' && 
    !pathname?.includes('/articles/') &&
    pathname !== '/messenger' &&
    pathname !== '/conversations' &&
    !pathname?.includes('/conversations/')
);

  if (!is404Page && currentUser) {
    return (
      <div className='fixed bottom-0 sm:h-[calc(100vh-99px)] md:h-[calc(100vh-130px)] bg-white z-10 shadow-md'>
        <div className='border-l-[1px]'>
          <div className='max-h-[1376px] flex justify-center'>
            <div className='flex flex-col items-center justify-center gap-3 md:gap-0 select-none'>
              <Categories />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;