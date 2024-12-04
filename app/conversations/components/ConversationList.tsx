"use client";

import clsx from 'clsx';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useConversation from '@/app/hooks/useConversation';
import { FullConversationType, SafeUser } from '@/app/types';
import ConversationBox from './ConversationBox';
import { FaUsers } from 'react-icons/fa6';
import GroupChatModal from './GroupChatModal';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: SafeUser[];
  currentUser?: SafeUser | null; 
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users, currentUser }) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      <aside className={clsx(`
          inset-y-0 pb-20 lg:pb-0 lg:block overflow-y-auto border-r border-gray-200 block w-full h-[86vh]
        `, isOpen ? 'hidden' : 'block w-full'
        )}
      >
        <div className='flex-col h-full border-r border-r-neutral-200'>
          <div className='flex justify-between mb-10 pt-8 mx-6'>
            <div className='text-3xl font-extrabold text-neutral-800'>Messages</div>
            <div
              title='Create a group chat' 
              onClick={() => setIsModalOpen(true)}
              className='rounded-full p-2 bg-gray-100 text-gray-700 cursor-pointer hover:scale-110 hover:bg-primary/30 transition'
            >
              <FaUsers size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              currentUser={currentUser}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ConversationList;