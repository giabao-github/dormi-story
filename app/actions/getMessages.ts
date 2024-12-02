import prisma from '@/app/libs/prismadb';

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const safeMessages = messages.map(message => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
      sender: {
        ...message.sender,
        createdAt: message.sender.createdAt.toISOString(),
        updatedAt: message.sender.updatedAt.toISOString(),
        emailVerified: message.sender.emailVerified ? message.sender.emailVerified.toISOString() : null,
      },
      seen: message.seen.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      })),
    }));

    return safeMessages;
  } catch (error: any) {
    return null;
  }
}

export default getMessages;