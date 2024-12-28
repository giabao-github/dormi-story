import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { id, buildingId, startDate, month, licensePlateImage, spot } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const building = await prisma.building.findUnique({ 
      where: { 
        id: buildingId 
      } 
    });

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + month);

    if (building) {
      if (building.availableSlots <= 0) {
        return NextResponse.json({ error: 'No available slots' }, { status: 400 });
      }
      const newParkingSpot = await prisma.parkingSpot.update({
        where: {
          id
        },
        data: {
          month,
          startDate,
          endDate,
          status: 'taken',
          licensePlateImage,
          spot
        }
      });
      await prisma.building.update({
        where: { 
          id: buildingId 
        },
        data: { 
          availableSlots: building.availableSlots - 1 
        },
      });
      return NextResponse.json(newParkingSpot);
    } else {
      return new NextResponse('Invalid building ID', { status: 400 });
    }
  } catch (error: any) {
    console.log('Error at /api/parking-lot/register:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
