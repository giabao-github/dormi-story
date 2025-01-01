import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import getParkingSpotsByBuildingId from '@/app/actions/getParkingSpotsByBuildingId';
import { notifySpotUpdate } from '@/app/libs/socket';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { spotId, buildingId } = body;

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!spotId) {
    return new NextResponse('Unknown reject request', { status: 400 });
  }

  try {
    const rejectedSpot = await prisma.parkingSpot.update({
      where: {
        id: spotId,
        buildingId,
      },
      data: {
        userId: null,
        month: null,
        startDate: null,
        endDate: null,
        licensePlateImage: null,
        spot: null,
        registeredAt: null,
        expiresAt: null,
        price: null,
        paid: null,
        status: 'available'
      },
      include: {
        user: true
      }
    });

    const availableSpots = await prisma.parkingSpot.count({
      where: {
        buildingId,
        status: 'available'
      }
    })

    await prisma.building.update({
      where: { 
        id: buildingId 
      },
      data: { 
        availableSpots: availableSpots
      },
    });

    const parkingSpots = await getParkingSpotsByBuildingId(buildingId);
    notifySpotUpdate(buildingId, parkingSpots);

    return NextResponse.json(rejectedSpot);
  } catch (error: any) {
    console.log('Error at /api/parking-spot/reject:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}