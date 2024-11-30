import prisma from '@/app/libs/prismadb';

interface IParams {
  articleId?: string;
}

export default async function getArticleById(params: IParams) {
  try {
    const { articleId } = await params;

    if (!articleId) {
      throw new Error('Article ID is not found');
    }
  
    const article = await prisma.article.findUnique({
      where: {
        id: articleId
      },
      include: {
        user: true
      }
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      createdAt: article.createdAt.toISOString(),
      user: {
        ...article.user,
        createdAt: article.user.createdAt.toISOString(),
        updatedAt: article.user.updatedAt.toISOString(),
        emailVerified: article.user.emailVerified?.toISOString() || null,
      }
    };
  } catch (error: any) {
    throw new Error(error);
  }
}