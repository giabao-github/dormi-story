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
    return new NextResponse('Unknown reject request', { status: 400 });
  }

  try {
    const rejectedRequest = await prisma.friend.deleteMany({
      where: {
        id: requestId,
        status: 'Pending'
      }
    });

    return NextResponse.json(rejectedRequest);
  } catch (error: any) {
    console.log('Error at /api/friend/reject:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}