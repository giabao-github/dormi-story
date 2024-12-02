"use client";

import { FaUserPlus } from 'react-icons/fa6';
import UserBox from './UserBox';
import { SafeUser } from '@/app/types';

interface UserListProps {
  items: SafeUser[]
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside className='inset-y-0 pb-20 lg:pb-0 lg:block overflow-y-auto border-r border-gray-200 block w-full h-[86vh]'>
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