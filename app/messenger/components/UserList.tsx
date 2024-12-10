"use client";

import { useEffect, useRef, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa6';
import UserBox from './UserBox';
import { SafeUser } from '@/app/types';
import useMessengerTab from '@/app/hooks/useMessengerTab';
import useMessengerSidebar from '@/app/hooks/useMessengerSidebar';

interface UserListProps {
  items: SafeUser[]
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  const [componentWidth, setComponentWidth] = useState<number | null>(null);

  const sidebar = useMessengerSidebar();
  const tab = useMessengerTab();
  const height = Math.round(tab.height + 212);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        const width = containerRef.current?.getBoundingClientRect().width;
        setComponentWidth(width || null);
      };

      updateWidth();
      window.addEventListener('resize', updateWidth);

      return () => {
        window.removeEventListener('resize', updateWidth);
      };
    }
  }, []);

  useEffect(() => {
    sidebar.setWidth(componentWidth || 0);
  }, [componentWidth]);


  useEffect(() => {
    document.documentElement.style.setProperty('--height', `${height}px`);
  }, [height]);


  return (
    <aside ref={containerRef} className='inset-y-0 pb-20 lg:pb-0 lg:block overflow-y-auto border-r border-gray-200 block w-full h-[calc(100vh-128px)]'>
      <div className='flex-col h-full'>
        <div className='flex justify-between mb-10 pt-8 mx-6'>
          <div className='text-3xl font-extrabold text-neutral-800'>Friends</div>
          <div
            title='Add friend'
            className='rounded-full p-2 bg-gray-100 text-gray-700 cursor-pointer hover:scale-110 hover:bg-primary/30 transition'
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        {items.map((item) => (
          <UserBox
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}

export default UserList;