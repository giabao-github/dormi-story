"use client";

import { useEffect, useRef, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa6';
import UserBox from './UserBox';
import { SafeReceivedRequest, SafeSentRequest, SafeUser } from '@/app/types';
import useMessengerTab from '@/app/hooks/useMessengerTab';
import useMessengerSidebar from '@/app/hooks/useMessengerSidebar';
import FriendModal from './FriendModal';

interface UserListProps {
  currentUser: SafeUser;
  sentRequests: SafeSentRequest[];
  receivedRequests: SafeReceivedRequest[];
  friendList: SafeUser[];
  allUsers: SafeUser[];
}

const UserList: React.FC<UserListProps> = ({ 
  currentUser, 
  sentRequests,
  receivedRequests,
  friendList, 
  allUsers
}) => {
  const [componentWidth, setComponentWidth] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <FriendModal
        currentUser={currentUser}
        sentRequests={sentRequests}
        receivedRequests={receivedRequests}
        friendList={friendList}
        users={allUsers}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      <aside ref={containerRef} className='inset-y-0 pb-20 lg:pb-0 lg:block overflow-y-auto border-r border-gray-200 block w-full h-[calc(100vh-128px)]'>
        <div className='flex-col h-full'>
          <div className='flex justify-between mb-10 pt-8 mx-6'>
            <div className='text-3xl font-extrabold text-neutral-800'>Friends</div>
            <div
              title='Add friend'
              onClick={() => setIsModalOpen(true)}
              className='rounded-full p-2 bg-gray-100 text-gray-700 cursor-pointer hover:scale-110 hover:bg-primary/30 transition'
            >
              <FaUserPlus size={20} />
            </div>
          </div>
          {
            friendList.length === 0 ?
            <div className='px-8 py-10 flex justify-center items-center h-[calc(100vh-310px)] w-full'>
              <p className='text-gray-500 text-base'>
                You have no friends. Let's add a friend to start chatting
              </p>
            </div> :
            friendList.map((user) => (
              <UserBox
                key={user.id}
                data={user}
              />
            ))
          }
        </div>
      </aside>
    </>
  );
}

export default UserList;