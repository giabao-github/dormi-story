"use client";

import { usePathname } from 'next/navigation';
import { SafeUser } from '@/app/types';
import Categories from './Categories';


interface SidebarProps {
  currentUser?: SafeUser | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const is404Page = pathname !== '/';

  if (!is404Page && currentUser) {
    return (
      <div className='absolute bottom-0 sm:h-[calc(100vh-99px)] md:h-[calc(100vh-130px)] bg-white z-10 shadow-md'>
        <div className='border-l-[1px]'>
          <div className='max-h-[1376px] flex justify-center'>
            <div className='flex flex-col items-center justify-center gap-3 md:gap-0'>
              <Categories />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;