"use client";

import { useMemo, useState } from 'react';
import Avatar from '@/app/components/Avatar';
import useOtherUser from '@/app/hooks/useOtherUser';
import { SafeUser } from '@/app/types';
import { Conversation } from '@prisma/client';
import { IoMenu } from 'react-icons/io5';
import ProfileDrawer from './ProfileDrawer';


interface HeaderProps {
  conversation: Conversation & {
    users: SafeUser[]
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return 'Active';
  }, [conversation]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className='flex gap-4 items-center'>
          <Avatar user={otherUser} type='messenger' />
          <div className='flex flex-col'>
            <div className='font-semibold'>
              {conversation.name || otherUser.name}
            </div>
            <div className='text-sm font-medium text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>
        <IoMenu
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='cursor-pointer text-primary/60 hover:text-primary transition' 
        />
      </div>
    </>
  );
}

export default Header;