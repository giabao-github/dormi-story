"use client";

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

import { FullConversationType, SafeUser } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean,
  currentUser?: SafeUser | null; 
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected, currentUser }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userName = useMemo(() => {
    return session?.data?.user?.name;
  }, [session?.data?.user?.name]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
        return 'You sent a photo';
      } else {
        return `${lastMessage.sender.name} sent a photo`;
      }
    }

    if (lastMessage?.body) {
      if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
        return `You: ${lastMessage.body}`;
      }
      return `${lastMessage.sender.name}: ${lastMessage.body}`;
    }

    return 'Started a conversation';
  }, [lastMessage]);


  return (
    <div 
    onClick={handleClick}
    className={clsx(`
        w-full relative flex items-center space-x-4 hover:bg-neutral-100 transition cursor-pointer p-4 
        `, selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
        <Avatar user={otherUser} type='messenger' />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div className='flex justify-between items-center mb-1'>
              <p className='text-xl font-semibold text-gray-900'>
              {
                otherUser.name.length > 24
                ? `${otherUser.name.slice(0, 24)}...`
                : otherUser.name ||
                (data.name && data.name.length > 24
                ? `${data.name.slice(0, 24)}...`
                : data?.name || 'Anonymous User')
              }
              </p>
            </div>
            <div className='flex justify-between items-center'>
              <p className={clsx(`
                  truncate text-sm  
                  `, hasSeen ? 'text-gray-500' : 'text-black font-medium'
                )}
              >
                {
                  lastMessageText.length > 40 ? 
                  `${lastMessageText.slice(0, 40)}...` :
                  lastMessageText
                }
              </p>
              {lastMessage?.createdAt && (
                <p className='text-sm text-gray-400 font-normal'>
                  {format(new Date(lastMessage.createdAt), 'p')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default ConversationBox;