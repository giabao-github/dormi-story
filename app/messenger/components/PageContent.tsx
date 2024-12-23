"use client";

import { useEffect } from 'react';
import ClientOnly from '@/app/components/ClientOnly';
import MessengerEmptyState from '@/app/components/MessengerEmptyState';
import useMessengerSidebar from '@/app/hooks/useMessengerSidebar';


const PageContent = () => {
  const sidebarWidth = useMessengerSidebar();
  const width = Math.round(sidebarWidth.width + 247);

  useEffect(() => {
    document.documentElement.style.setProperty('--width', `${width}px`);
  }, [width]);


  return (
    <ClientOnly>
      <title>Dormistory | Messenger</title>
        <div className='max-w-[2520px] h-[calc(100vh-128px)] w-[calc(100vw-var(--width))] grid grid-cols-1 gap-8 fixed right-0 bottom-0'>
          <div className='hidden lg:block h-full w-full'>
            <MessengerEmptyState />
          </div>
        </div>
    </ClientOnly>
  );
}

export default PageContent;