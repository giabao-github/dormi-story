"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MdGroups } from 'react-icons/md';
import { BsChatFill } from 'react-icons/bs';
import useMessengerTab from '../hooks/useMessengerTab';


const MessengerTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [componentHeight, setComponentHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tab = useMessengerTab();

  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        const height = containerRef.current?.getBoundingClientRect().height;
        setComponentHeight(height || null);
      };

      updateHeight();
      window.addEventListener('resize', updateHeight);

      return () => {
        window.removeEventListener('resize', updateHeight);
      };
    }
  }, []);

  useEffect(() => {
    tab.setHeight(componentHeight || 0);
  }, [componentHeight]);


  return (
    <div ref={containerRef} className='sticky bottom-0 h-[8%] py-4 flex flex-row border-r border-gray-200 bg-neutral-50 shadow-sm z-10'>
      <div className='flex justify-center items-center w-1/2'>
        <MdGroups 
          size={34}
          className={`${pathname === '/messenger' ? 'text-primary' : 'text-neutral-300 hover:text-primary/70'} cursor-pointer`}
          onClick={() => {
            if (pathname !== '/messenger') {
              router.push('/messenger');
            }
          }}
        />
      </div>
      <div className='flex justify-center items-center w-1/2'>
        <BsChatFill 
          size={24}
          className={`${pathname === '/conversations' || pathname?.includes('/conversations/') ? 'text-primary' : 'text-neutral-300 hover:text-primary/70'} cursor-pointer`}
          onClick={() => {
            if (pathname !== '/conversations' || !pathname?.includes('/conversations/')) {
              router.push('/conversations');
            }
          }}
        />
      </div>
    </div>
  );
}

export default MessengerTab;