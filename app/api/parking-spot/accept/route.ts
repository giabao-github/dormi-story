import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import getParkingSpotsByBuildingId from '@/app/actions/getParkingSpotsByBuildingId';
import { notifySpotUpdate } from '@/app/libs/socket';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { spotId, buildingId, userId } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!spotId) {
    return new NextResponse('Unknown accept request', { status: 400 });
  }

  try {
    const acceptedSpot = await prisma.parkingSpot.update({
      where: {
        id: spotId,
        buildingId,
        userId,
      },
      data: {
        status: 'taken',
        paid: true
      },
      include: {
        user: true
      }
    });

    const parkingSpots = await getParkingSpotsByBuildingId(buildingId);
    notifySpotUpdate(buildingId, parkingSpots);

    return NextResponse.json(acceptedSpot);
  } catch (error: any) {
    console.log('Error at /api/parking-spot//accept:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}