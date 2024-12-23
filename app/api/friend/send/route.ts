import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { receiverId } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!receiverId) {
    return new NextResponse('Unknown send request', { status: 400 });
  }

  try {
    const existingRequest = await prisma.friend.findFirst({
      where: {
        senderId: currentUser.id,
        receiverId: receiverId,
        status: 'Pending',
      },
    });

    if (existingRequest) {
      return NextResponse.json(existingRequest);
    }

    const friendRequest = await prisma.friend.create({
      data: {
        senderId: currentUser.id,
        receiverId: receiverId,
        status: 'Pending',
      },
    });

    return NextResponse.json(friendRequest);
  } catch (error: any) {
    console.log('Error at /api/friend/send:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}