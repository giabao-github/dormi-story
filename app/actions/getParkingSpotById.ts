import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser';

export default async function getParkingSpotById(id: string) {
  try {
    const currentUser = await getCurrentUser(); 

    if (!currentUser?.id) {
      return [];
    }

    const parkingSpot = await prisma.parkingSpot.findUnique({
      where: {
        id
      },
      include: {
        building: true
      }
    });

    return parkingSpot;
  } catch (error: any) {
    throw new Error(error);
  }
}