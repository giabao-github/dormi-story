"use client";

import clsx from 'clsx';
import { find } from 'lodash';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useConversation from '@/app/hooks/useConversation';
import { FullConversationType, SafeUser } from '@/app/types';
import ConversationBox from './ConversationBox';
import { FaUsers } from 'react-icons/fa6';
import GroupChatModal from './GroupChatModal';
import { pusherClient } from '@/app/libs/pusher';
import useMessengerSidebar from '@/app/hooks/useMessengerSidebar';
import useMessengerTab from '@/app/hooks/useMessengerTab';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: SafeUser[];
  currentUser?: SafeUser | null; 
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users, currentUser }) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentWidth, setComponentWidth] = useState<number | null>(null);

  const router = useRouter();
  const session = useSession();
  const sidebar = useMessengerSidebar();
  const tab = useMessengerTab();
  const height = Math.round(tab.height + 212);
  const containerRef = useRef<HTMLDivElement>(null);

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const handleNewConversation = (conversation: FullConversationType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    }

    const handleConversationUpdate = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: currentConversation.messages,
          }
        }
        return currentConversation;
      }));
    }

    const handleConversationDelete = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((conv) => conv.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push('/conversations');
      }
    }

    pusherClient.bind('conversation:new', handleNewConversation);
    pusherClient.bind('conversation:update', handleConversationUpdate);
    pusherClient.bind('conversation:remove', handleConversationDelete);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', handleNewConversation);
      pusherClient.unbind('conversation:update', handleConversationUpdate);
      pusherClient.unbind('conversation:remove', handleConversationDelete);
    }
  }, [pusherKey, conversationId, router]);

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
      <GroupChatModal
        users={users}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      <aside 
        ref={containerRef}
        className={clsx(`
          inset-y-0 lg:block border-r border-gray-200 h-[calc(100vh-128px)]
        `, isOpen ? 'hidden' : 'block w-full'
        )}
      >
        <div className='flex-col h-full'>
          <div className='sticky top-0 z-10 bg-white shadow-sm flex justify-between p-6 xl:px-10'>
            <div className='text-3xl font-extrabold text-neutral-800'>Messages</div>
            <div
              title='Create a group chat' 
              onClick={() => setIsModalOpen(true)}
              className='rounded-full p-2 bg-gray-100 text-gray-700 cursor-pointer hover:scale-110 hover:bg-primary/30 transition'
            >
              <FaUsers size={20} />
            </div>
          </div>
          <div className='overflow-y-auto h-[calc(100vh-var(--height))] w-full'>
            {items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default ConversationList;