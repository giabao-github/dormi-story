import prisma from '@/app/libs/prismadb';

export async function getSentFriendRequests(userId: string) {
  if (!userId) {
    return [];
  }

  try {
    const requests = await prisma.friend.findMany({
      where: {
        senderId: userId,
        status: { in: ['Pending', 'Rejected'] },
      },
      include: {
        receiver: true,       
      },
    });

    return requests.map((request) => ({
      id: request.id,
      status: request.status,
      receiverId: request.receiverId,
      senderId: request.senderId,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      receiver: {
        id: request.receiver.id,
        name: request.receiver.name,
        studentId: request.receiver.studentId,
        email: request.receiver.email,
        emailVerified: request.receiver.emailVerified ? request.receiver.emailVerified.toISOString() : null,
        image: request.receiver.image,
        createdAt: request.receiver.createdAt.toISOString(),
        updatedAt: request.receiver.updatedAt.toISOString(),
        hashedPassword: request.receiver.hashedPassword,
        messengerSecretToken: request.receiver.messengerSecretToken,
        conversationIds: request.receiver.conversationIds || [],
        seenMessageIds: request.receiver.seenMessageIds || [],
      },
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}