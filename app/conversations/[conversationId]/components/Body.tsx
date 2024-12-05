"use client";

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { find } from 'lodash';
import useConversation from '@/app/hooks/useConversation';
import { FullMessageType, SafeUser } from '@/app/types';
import { pusherClient } from '@/app/libs/pusher';
import MessageBox from './MessageBox';

interface BodyProps {
  initialMessages: FullMessageType[];
  currentUser?: SafeUser | null;
}

const Body: React.FC<BodyProps> = ({ initialMessages, currentUser }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const handleNewMessages = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView();
    }

    const handleMessageUpdate = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage;
      }));
    }

    pusherClient.bind('messages:new', handleNewMessages);
    pusherClient.bind('message:update', handleMessageUpdate);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', handleNewMessages);
      pusherClient.unbind('message:update', handleMessageUpdate);
    }
  }, [conversationId]);


  return (
    <div className='pt-4 flex-1 overflow-y-auto'>
      {messages.map((message, index) => (
        <MessageBox
          isLast={index === messages.length - 1}
          key={message.id}
          data={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className='pt-4' />
    </div>
  );
}

export default Body;