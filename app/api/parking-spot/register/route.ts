import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { id, buildingId, startDate, endDate, month, licensePlateImage, spot, price, bill } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const building = await prisma.building.findUnique({ 
      where: { 
        id: buildingId 
      } 
    });

    const now = new Date();
    const expire = new Date(now);
    expire.setHours(23, 59, 59, 999);
    expire.setDate(expire.getDate() + 3);

    if (building) {
      if (building.availableSpots <= 0) {
        return NextResponse.json({ error: 'No available slots' }, { status: 400 });
      }

      const newParkingSpot = await prisma.parkingSpot.update({
        where: {
          id,
          userId: currentUser.id,
          buildingId
        },
        data: {
          month,
          startDate,
          endDate,
          status: 'registered',
          licensePlateImage,
          spot,
          price,
          bill,
          paid: !!bill,
          registeredAt: now,
          expiresAt: expire
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

      return NextResponse.json(newParkingSpot);
    } else {
      return new NextResponse('Invalid building ID', { status: 400 });
    }
  } catch (error: any) {
    console.log('Error at /api/parking-lot/register:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
