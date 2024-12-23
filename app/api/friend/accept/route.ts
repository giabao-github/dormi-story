import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { requestId } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!requestId) {
    return new NextResponse('Unknown accept request', { status: 400 });
  }

  try {
    const acceptedRequest = await prisma.friend.update({
      where: {
        id: requestId,
      },
      data: {
        status: 'Accepted'
      },
      include: {
        receiver: true, 
      },
    });

    return NextResponse.json(acceptedRequest);
  } catch (error: any) {
    console.log('Error at /api/friend/accept:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}