import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { name, capacity, price } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  try {
    const building = await prisma.building.create({
      data: {
        name,
        capacity,
        availableSlots: capacity,
        price,
        userId: currentUser.id
      },
    });
    for (let index = 0; index < capacity; index++) {
      await prisma.parkingSpot.create({
        data: {
          buildingId: building.id,
          status: 'available'
        },
        include: {
          building: true,
          user: true
        }
      });
    }
    return NextResponse.json(building);
  } catch (error: any) {
    console.log('Error at /api/building:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}