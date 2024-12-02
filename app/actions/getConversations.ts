import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id,
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    });

    const safeConversations = conversations.map(conversation => ({
      ...conversation,
      createdAt: conversation.createdAt.toISOString(),
      lastMessageAt: conversation.lastMessageAt ? conversation.lastMessageAt.toISOString() : null,
      users: conversation.users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      })),
      messages: conversation.messages.map(message => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))
    }));

    return safeConversations;
  } catch (error: any) {
    return [];
  }
}

export default getConversations;