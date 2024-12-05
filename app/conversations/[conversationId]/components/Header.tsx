"use client";

import { useMemo, useState } from 'react';
import Avatar from '@/app/components/Avatar';
import useOtherUser from '@/app/hooks/useOtherUser';
import { SafeUser } from '@/app/types';
import { Conversation } from '@prisma/client';
import { IoMenu } from 'react-icons/io5';
import ProfileDrawer from './ProfileDrawer';
import GroupAvatar from '@/app/components/GroupAvatar';
import useActiveList from '@/app/hooks/useActiveList';


interface HeaderProps {
  conversation: Conversation & {
    users: SafeUser[]
  };
  currentUser: SafeUser | null;
}

const Header: React.FC<HeaderProps> = ({ conversation, currentUser }) => {
  const otherUser = useOtherUser(conversation, currentUser);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        currentUser={currentUser}
        onClose={() => setDrawerOpen(false)}
      />
      <div className='bg-white w-full flex border-b-[1px] border-l-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className='flex gap-4 items-center'>
          {conversation.isGroup ? (
            <GroupAvatar users={conversation.users} />
          ) : (
            <Avatar user={otherUser} type='messenger' />
          )}
          <div className='flex flex-col gap-y-1 mx-2'>
            <div className='text-xl font-semibold'>
              {conversation.name || otherUser.name}
            </div>
            <div className='mx-1 text-sm font-medium text-neutral-500'>
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