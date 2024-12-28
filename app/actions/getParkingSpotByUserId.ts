import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

export default async function getParkingSpotByUserId() {
  try {
    const currentUser = await getCurrentUser(); 

    if (!currentUser?.id) {
      return [];
    }

    const parkingSpots = await prisma.parkingSpot.findMany({
      where: {
        userId: currentUser?.id,
        status: 'taken'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        building: true
      }
    });

    const safeParkingSpots = parkingSpots.map(parkingLot => ({
      ...parkingLot,
      startDate: parkingLot.startDate?.toISOString(),
      endDate: parkingLot.endDate?.toISOString(),
      createdAt: parkingLot.createdAt.toISOString(),
      building: {
        ...parkingLot.building,
        createdAt: parkingLot.building.createdAt.toISOString(),
      }
    }));

    return safeParkingSpots;
  } catch (error: any) {
    throw new Error(error);
  }
}