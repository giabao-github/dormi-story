import prisma from '@/app/libs/prismadb';

export async function getFriendRequests(userId: string) {
  try {
    const requests = await prisma.friend.findMany({
      where: {
        receiverId: userId, 
        status: { in: ['Pending'] }, 
      },
      include: {
        sender: true,       
      },
    });

    return requests.map((request) => ({
      ...request,
      sender: {
        id: request.id,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
      }
    }))
  } catch (error: any) {
    throw new Error(error);
  }
}