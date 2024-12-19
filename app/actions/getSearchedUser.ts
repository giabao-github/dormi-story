import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';


export default async function getSearchedUser(receiverEmail: string, receiverToken: string) {
  const currentUser = await getCurrentUser();

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: currentUser?.email,
        },
        email: receiverEmail,
        messengerSecretToken: receiverToken,
      }
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
