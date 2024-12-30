import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser';

export default async function getBuildingById(buildingId: string | undefined) {
  try {
    const currentUser = await getCurrentUser(); 

    if (!currentUser?.id) {
      return null;
    }

    if (!buildingId) {
      return null;
    }

    const building = await prisma.building.findUnique({
      where: {
        id: buildingId
      },
    });

    return building;
  } catch (error: any) {
    throw new Error(error);
  }
}