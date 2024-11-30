import prisma from '@/app/libs/prismadb';

export default async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeArticles = articles.map(article => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
    }));

    return safeArticles;
  } catch (error: any) {
    throw new Error(error);
  }
}