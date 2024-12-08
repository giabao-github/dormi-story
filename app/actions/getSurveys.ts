import prisma from '@/app/libs/prismadb';

export default async function getSurveys() {
  try {
    const surveys = await prisma.survey.findMany({
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