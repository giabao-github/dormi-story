import { Article, User } from '@prisma/client';

export type SafeArticle = Omit<
  Article,
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