"use client";

import clsx from 'clsx';
import EmptyState from '@/app/components/EmptyState';
import useConversation from '@/app/hooks/useConversation';
import ClientOnly from '@/app/components/ClientOnly';

const ConversationPage = () => {
  const { isOpen } = useConversation();

  return (
    <ClientOnly>
      <div className={clsx(
        'h-full lg:block',
        isOpen ? 'block' : 'hidden'
      )}
      >
        <EmptyState />
      </div>
    </ClientOnly>
  );
}

export default ConversationPage;