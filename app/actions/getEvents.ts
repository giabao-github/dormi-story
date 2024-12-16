import prisma from '../libs/prismadb';

export interface IEventParams {
  userId?: string;
  title?: string;
  creator?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export default async function getEvents(params: IEventParams) {
  try {
    const { userId, title, creator, startDate, endDate, category } = params;

    if (!userId) {
      throw new Error('User ID is not found');
    }

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (title) {
      query.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (creator) {
      query.author = {
        contains: creator,
        mode: 'insensitive',
      };
    }

    if (category && category !== 'all') {
      const categoriesArray = category.split(',');
      query.category = {
        in: categoriesArray,
      };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.lte = new Date(endDate);
      }
    }

    const events = await prisma.event.findMany({
      where: query,
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