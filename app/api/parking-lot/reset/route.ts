import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { userId } = body;

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const resetData = await prisma.parkingSpot.updateMany({
      where: {
        userId,
        status: 'locked',
      },
      data: {
        userId: null,
        status: 'available',
      },
    });

    return NextResponse.json(resetData);
  } catch (error: any) {
    console.log('Error at /api/parking-lot/reset:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
