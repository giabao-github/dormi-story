import { Article, Survey, User, Conversation, Message } from '@prisma/client';

export type SafeArticle = Omit<
  Article,
  'createdAt'
> & {
  createdAt: string;
};

export type SafeSurvey = Omit<
  Survey,
  'createdAt'
> & {
  createdAt: string;
};

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type FullMessageType = Omit<Message, 'createdAt'> & {
  createdAt: string;
  sender: SafeUser;
  seen: SafeUser[];
};

export type FullConversationType = Omit<Conversation, 'createdAt' | 'lastMessageAt'> & {
  createdAt: string;
  lastMessageAt: string | null; 
  users: SafeUser[];
  messages: FullMessageType[],
};  