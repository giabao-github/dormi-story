import prisma from '@/app/libs/prismadb';

export async function getReceivedFriendRequests(userId: string) {
  if (!userId) {
    return [];
  }

  try {
    const requests = await prisma.friend.findMany({
      where: {
        receiverId: userId, 
        status: { in: ['Accepted', 'Pending', 'Rejected'] }, 
      },
      include: {
        sender: true,       
      },
    });

    return requests.map((request) => ({
      id: request.id,
      status: request.status,
      receiverId: request.receiverId,
      senderId: request.senderId,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      sender: {
        id: request.sender.id,
        name: request.sender.name,
        studentId: request.sender.studentId,
        email: request.sender.email,
        emailVerified: request.sender.emailVerified ? request.sender.emailVerified.toISOString() : null,
        image: request.sender.image,
        createdAt: request.sender.createdAt.toISOString(),
        updatedAt: request.sender.updatedAt.toISOString(),
        hashedPassword: request.sender.hashedPassword,
        messengerSecretToken: request.sender.messengerSecretToken,
        conversationIds: request.sender.conversationIds || [],
        seenMessageIds: request.sender.seenMessageIds || [],
      },
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}