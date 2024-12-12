import prisma from '../libs/prismadb';

export default async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    const safeEvents = events.map(event => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
      user: {
        ...event.user,
        createdAt: event.user.createdAt.toISOString(),
        updatedAt: event.user.updatedAt.toISOString(),
        emailVerified: event.user.emailVerified?.toISOString() || null,
      }
    }));

    return safeEvents;
  } catch (error: any) {
    throw new Error(error);
  }
}