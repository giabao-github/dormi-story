import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/app/libs/prismadb';


const capitalizeEmail = (email: string): string => {
  const [localPart, domainPart] = email.split('@');

  if (!domainPart || !localPart) {
    throw new Error('Invalid student email format');
  }

  const formattedLocalPart = localPart.toUpperCase();
  return `${formattedLocalPart}@${domainPart}`;
}

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const formattedEmail = capitalizeEmail(session.user.email);

    const currentUser = await prisma.user.findUnique({
      where: {
        email: formattedEmail as string,
      }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    console.log("Error at getCurrentUser.ts:", error);
    return null;
  }
}