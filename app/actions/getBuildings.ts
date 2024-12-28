import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';


export default async function getBuildings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return [];
    }

    const buildings = await prisma.building.findMany();

    return buildings;
  } catch (error: any) {
    throw new Error(error);
  }
}