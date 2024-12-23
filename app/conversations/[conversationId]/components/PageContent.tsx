"use client";

import { FullMessageType, SafeUser } from '@/app/types';
import { Conversation } from '@prisma/client';
import Header from './Header';
import Body from './Body';
import Form from './Form';
import useMessengerSidebar from '@/app/hooks/useMessengerSidebar';
import { useEffect } from 'react';

interface PageContentProps {
  currentUser: SafeUser | null;
  conversation: Conversation & {
    users: SafeUser[]
  };
  initialMessages: FullMessageType[];
}

const PageContent: React.FC<PageContentProps> = ({ currentUser, conversation, initialMessages }) => {
  const sidebarWidth = useMessengerSidebar();
  const width = Math.round(sidebarWidth.width + 247);

  useEffect(() => {
    document.documentElement.style.setProperty('--width', `${width}px`);
  }, [width]);

  return (
    <div className='h-[calc(100vh-128px)] w-[calc(100vw-var(--width))] fixed bottom-0 right-0 overflow-y-auto'>
      <div className='h-full flex flex-col'>
        <Header conversation={conversation} currentUser={currentUser} />
        <Body initialMessages={initialMessages} currentUser={currentUser} />
        <Form currentUser={currentUser} />
      </div>
    </div>
  );
}

export default PageContent;