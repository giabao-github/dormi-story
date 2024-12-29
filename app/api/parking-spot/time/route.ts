import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import getParkingSpotById from '@/app/actions/getParkingSpotById';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { id, buildingId, userId, time } = body;

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.parkingSpot.update({
      where: {
        id,
        buildingId,
        userId,
        status: 'locked',
      },
      data: {
        time
      },
    });

    const updatedSpot = await getParkingSpotById(id);
    return NextResponse.json(updatedSpot);
  } catch (error: any) {
    console.log('Error at /api/parking-lot/time:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
