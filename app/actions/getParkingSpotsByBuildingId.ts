import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser';

export default async function getParkingSpotsByBuildingId(buildingId: string) {
  try {
    const currentUser = await getCurrentUser(); 

    if (!currentUser?.id) {
      return [];
    }

    const parkingSpots = await prisma.parkingSpot.findMany({
      where: {
        buildingId: buildingId
      },
      orderBy: {
        createdAt: 'asc'
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