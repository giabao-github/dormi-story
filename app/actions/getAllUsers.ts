import prisma from '@/app/libs/prismadb';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const getAllUsers = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      image: user.image,
      hashedPassword: user.hashedPassword,
      messengerSecretToken: user.messengerSecretToken,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      conversationIds: user.conversationIds || [],
      seenMessageIds: user.seenMessageIds || [],  
    }));
  } catch (error: any) {
    return [];
  }
}

export default getAllUsers;