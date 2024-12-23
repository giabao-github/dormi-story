import { Article, Survey, User, Conversation, Message, Report, Friend } from '@prisma/client';

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

export type SafeReport = Omit<
  Report,
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

export type SafeSentRequest = Omit<
  Friend,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
  receiver: SafeUser;
};

export type SafeReceivedRequest = Omit<
  Friend,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
  sender: SafeUser;
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