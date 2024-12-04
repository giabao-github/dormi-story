import prisma from '@/app/libs/prismadb';

export default async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
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