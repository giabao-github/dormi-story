import prisma from '@/app/libs/prismadb';

export interface IReportParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export default async function getReportsByUserId(params: IReportParams) {
  try {
    const { userId, startDate, endDate, category } = params;

    if (!userId) {
      throw new Error('User ID is not found');
    }

    let query: any = {};

    if (userId) {
      query.userId = userId;
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

    const reports = await prisma.report.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    return reports.map(report => ({
      ...report,
      createdAt: report.createdAt.toISOString(),
      user: {
        ...report.user,
        createdAt: report.user.createdAt.toISOString(),
        updatedAt: report.user.updatedAt.toISOString(),
        emailVerified: report.user.emailVerified?.toISOString() || null,
      }
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}