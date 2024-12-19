import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';


export default async function getFriendsByUserId() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  try {
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, status: 'Accepted' },
          { receiverId: currentUser.id, status: 'Accepted' },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    
    const friends = friendships.map((friendship) => friendship.senderId === currentUser.id ? friendship.receiver : friendship.sender);

    if (friends.length === 0) {
      return [];
    }

    return friends.map((user) => ({
      ...user,
      id: user.id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
      image: user.image,
      messengerSecretToken: user.messengerSecretToken,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  } catch (error: any) {
    return [];
  }
}