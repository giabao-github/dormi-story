import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import getParkingSpotsByBuildingId from '@/app/actions/getParkingSpotsByBuildingId';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { id, buildingId, userId } = body;

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!id || typeof id !== 'string') {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    await prisma.parkingSpot.updateMany({
      where: {
        NOT: { id },
        userId,
        buildingId,
        status: 'locked',
      },
      data: {
        userId: null,
        status: 'available',
      },
    });
    await prisma.parkingSpot.update({
      where: {
        id,
        buildingId,
      },
      data: {
        userId,
        status: 'locked'
      },
    });

    const parkingSpots = await getParkingSpotsByBuildingId(buildingId);

    return NextResponse.json(parkingSpots);
  } catch (error: any) {
    console.log('Error at /api/parking-lot/fetch:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
