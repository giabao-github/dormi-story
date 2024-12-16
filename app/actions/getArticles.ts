import prisma from '@/app/libs/prismadb';

export interface IArticleParams {
  userId?: string;
  title?: string;
  authorName?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export default async function getArticles(params: IArticleParams) {
  try {
    const { userId, title, authorName, startDate, endDate, category } = params;

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

    if (authorName) {
      query.author = {
        contains: authorName,
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

    const articles = await prisma.article.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    const safeArticles = articles.map(article => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      user: {
        ...article.user,
        createdAt: article.user.createdAt.toISOString(),
        updatedAt: article.user.updatedAt.toISOString(),
        emailVerified: article.user.emailVerified?.toISOString() || null,
      }
    }));

    return safeArticles;
  } catch (error: any) {
    throw new Error(error);
  }
}