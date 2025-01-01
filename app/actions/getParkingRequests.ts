import prisma from '@/app/libs/prismadb';

export async function getParkingRequests() {
  try {
    const requests = await prisma.parkingSpot.findMany({
      where: {
        status: { in: ['registered'] }, 
      },
      include: {
        building: true,
        user: true,
      },
    });
    
    return requests.map((request) => ({
      ...request,
      id: request.id,
      buildingId: request.buildingId,
      userId: request.userId,
      spot: request.spot,
      month: request.month,
      price: request.price,
      paid: request.paid,
      user: {
        id: request.user?.id ? request.user.id : '',
        name: request.user?.name ? request.user.name : '',
        studentId: request.user?.studentId ? request.user.studentId : '',
        email: request.user?.email ? request.user.email : '',
        emailVerified: request.user?.emailVerified ? request.user?.emailVerified.toISOString() : null,
        image: request.user?.image ? request.user.image : '',
        createdAt: request.user?.createdAt ? request.user.createdAt.toISOString() : '',
        updatedAt: request.user?.updatedAt ? request.user.updatedAt.toISOString() : '',
        hashedPassword: request.user?.hashedPassword ? request.user.hashedPassword : '',
        messengerSecretToken: request.user?.messengerSecretToken ? request.user.messengerSecretToken : '',
        conversationIds: request.user?.conversationIds || [],
        seenMessageIds: request.user?.seenMessageIds || [],
      },
      building: {
        ...request.building,
        name: request.building.name,
        capacity: request.building.capacity,
        availableSpots: request.building.availableSpots,
      },
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}