import prisma from '@/app/libs/prismadb';

export default async function getArticles() {
  try {
    return await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}