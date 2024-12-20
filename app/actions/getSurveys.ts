import prisma from '@/app/libs/prismadb';

export interface ISurveyParams {
  userId?: string;
  title?: string;
  creator?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export default async function getSurveys(params: ISurveyParams) {
  try {
    const { userId, title, creator, startDate, endDate, category } = params;

    if (!userId) {
      return [];
    }

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (title) {
      const normalizedTitle = title.trim().toLowerCase();
      const titleTerms = normalizedTitle.split(/\s+/);

      // Create an array of conditions for each term
      const titleConditions = titleTerms.map(term => ({
        title: {
          contains: term,
          mode: 'insensitive',
        }
      }));

      // Combine title conditions with AND logic
      query.AND = query.AND || [];
      query.AND.push({
        OR: titleConditions
      });
    }

    if (creator) {
      const normalizedCreator = creator.trim().toLowerCase();
      const creatorTerms = normalizedCreator.split(/\s+/);

      // Create an array of conditions for each term
      const creatorConditions = creatorTerms.map(term => ({
        creator: {
          contains: term,
          mode: 'insensitive',
        }
      }));

      // Combine creator conditions with AND logic
      query.AND = query.AND || [];
      query.AND.push({
        OR: creatorConditions
      });
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

    const surveys = await prisma.survey.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    const safeSurveys = surveys.map(survey => ({
      ...survey,
      createdAt: survey.createdAt.toISOString(),
      user: {
        ...survey.user,
        createdAt: survey.user.createdAt.toISOString(),
        updatedAt: survey.user.updatedAt.toISOString(),
        emailVerified: survey.user.emailVerified?.toISOString() || null,
      }
    }));

    return safeSurveys;
  } catch (error: any) {
    throw new Error(error);
  }
}