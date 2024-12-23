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
    return new NextResponse('Unknown cancel request', { status: 400 });
  }

  try {
    const canceledRequest = await prisma.friend.deleteMany({
      where: {
        id: requestId,
        status: 'Pending'
      }
    });

    return NextResponse.json(canceledRequest);
  } catch (error: any) {
    console.log('Error at /api/friend/cancel:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}