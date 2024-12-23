"use client";

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

import { FullConversationType, SafeUser } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import GroupAvatar from '@/app/components/GroupAvatar';

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean,
  currentUser?: SafeUser | null; 
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected, currentUser }) => {
  const otherUser = useOtherUser(data, currentUser || null);
  const session = useSession();
  const router = useRouter();

  const detectFileType = (url: string): string => {
    const fileTypes: { [key: string]: string } = {
      // Image file extensions
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'bmp': 'image',
      'svg': 'image',
      'webp': 'image',
      // Audio file extensions
      'mp3': 'audio',
      'wav': 'audio',
      'flac': 'audio',
      'aac': 'audio',
      'ogg': 'audio',
      'm4a': 'audio',
      // Video file extensions
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
      'wmv': 'video',
      'mkv': 'video',
      'flv': 'video',
      'webm': 'video',
      // Document file extensions
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'ppt': 'document',
      'pptx': 'document',
      'xls': 'document',
      'xlsx': 'document',
      'txt': 'document',
      'csv': 'document',
    };

    const extensionMatch = url.split('.').pop()?.toLowerCase();

    // Match the extension to a file type
    if (extensionMatch && fileTypes[extensionMatch]) {
      return fileTypes[extensionMatch];
    }

    return 'unknown';
  };

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
      if (detectFileType(lastMessage.image) === 'image') {
        if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
          return 'You sent a photo';
        } else {
          return `${lastMessage.sender.name} sent a photo`;
        }
      } else if (detectFileType(lastMessage.image) === 'audio') {
        if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
          return 'You sent an audio';
        } else {
          return `${lastMessage.sender.name} sent an audio`;
        }
      } else if (detectFileType(lastMessage.image) === 'video') {
        if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
          return 'You sent a video';
        } else {
          return `${lastMessage.sender.name} sent a video`;
        }
      } else if (detectFileType(lastMessage.image) === 'document') {
        if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
          return 'You sent a document';
        } else {
          return `${lastMessage.sender.name} sent a document`;
        }
      }
    };

    if (lastMessage?.body) {
      if (lastMessage.sender.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
        return `You: ${lastMessage.body}`;
      }
      return `${lastMessage.sender.name}: ${lastMessage.body}`;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  const displayName = () => {
    if (data.isGroup) {
      if (data.name && data.name.length > 24) {
        return `${otherUser.name.slice(0, 24)}...`;
      } else if (data.name) {
        return data.name;
      } 
    }
    else if (otherUser.name && otherUser.name.length > 24) {
      return`${otherUser.name.slice(0, 24)}...`;
    }
    else if (otherUser.name) {
      return otherUser.name;
    } else {
      return 'Anonymous User';
    }
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `${format(date, 'p')}`;
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return `${format(date, 'EEEE')}`;
    }  else if (isThisYear(date)) {
      return `${format(date, 'MMM d')}`;
    } else {
      return `${format(date, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={clsx(`
        w-full relative flex items-center overflow-y-auto space-x-4 hover:bg-neutral-100 transition cursor-pointer p-4 xl:px-8 
        `, selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <GroupAvatar users={data.users} />  
      ) : (
        <Avatar user={otherUser} type='messenger' />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className='xl:text-lg 2xl:text-xl font-semibold text-gray-900'>
              {displayName()}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <p className={clsx(`
                truncate text-sm w-[70%] 
                `, hasSeen ? 'text-gray-500' : 'text-black font-medium'
              )}
            >
              {lastMessageText}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-sm text-gray-400 font-normal'>
                {formatDate(new Date(lastMessage.createdAt))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationBox;