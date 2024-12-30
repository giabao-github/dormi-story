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
        status: {
          in: ['taken', 'registered'],
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        building: true
      }
    });

    return parkingSpots;
  } catch (error: any) {
    throw new Error(error);
  }
}