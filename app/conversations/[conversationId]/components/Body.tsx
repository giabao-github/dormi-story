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
  const isInitialLoad = useRef(true);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessages = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
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


  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (messages.length > 0) {
      const timeout = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const timeout = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
      }, 170);
      return () => clearTimeout(timeout);
    }
  }, []);


  return (
    <div className='pt-4 flex-1 overflow-y-auto shadow-sm'>
      {messages.map((message, index) => (
        <MessageBox
          isLast={index === messages.length - 1}
          key={message.id}
          data={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default Body;