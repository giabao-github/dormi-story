import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { requestId } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!requestId) {
    return new NextResponse('Unknown unfriend request', { status: 400 });
  }

  try {
    const unfriendRequest = await prisma.friend.deleteMany({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId: requestId,
            status: { in: ['Accepted', 'Dismissed'] } 
          },
          {
            senderId: requestId,
            receiverId: currentUser.id,
            status: { in: ['Accepted', 'Dismissed'] } 
          }
        ]
      }
    });

    return NextResponse.json(unfriendRequest);
  } catch (error: any) {
    console.log('Error at /api/friend/unfriend:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}