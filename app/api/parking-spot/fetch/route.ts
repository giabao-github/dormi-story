import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getParkingSpotsByBuildingId from '@/app/actions/getParkingSpotsByBuildingId';
import { notifySpotUpdate } from '@/app/libs/socket';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { buildingId } = body;
    const parkingSpots = await getParkingSpotsByBuildingId(buildingId);
    notifySpotUpdate(buildingId, parkingSpots);

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(parkingSpots);
  } catch (error: any) {
    console.log('Error at /api/parking-lot/fetch:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
