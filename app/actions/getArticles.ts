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

    if (authorName) {
      const normalizedAuthor = authorName.trim().toLowerCase();
      const authorTerms = normalizedAuthor.split(/\s+/);

      // Create an array of conditions for each term
      const authorConditions = authorTerms.map(term => ({
        author: {
          contains: term,
          mode: 'insensitive',
        }
      }));

      // Combine author conditions with AND logic
      query.AND = query.AND || [];
      query.AND.push({
        OR: authorConditions
      });
    }

    if (category && category !== 'all') {
      const categoriesArray = category.split(',').map((cat) => cat.trim());
      const categoryConditions = categoriesArray.map(category => ({
        category: {
          contains: category,
          mode: 'insensitive',
        }
      }));
      query.AND = query.AND || [];
      query.AND.push({
        OR: categoryConditions
      });
    }


    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.lte = end;
      }
    }

    const articles = await prisma.article.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      },
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