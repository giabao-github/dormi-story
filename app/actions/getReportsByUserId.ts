import prisma from '@/app/libs/prismadb';

export default async function getReportsByUserId(userId: string | undefined) {
  try {
    if (!userId) {
      throw new Error('User ID is not found');
    }

    const reports = await prisma.report.findMany({
      where: {
        userId: userId
      },
    });

    if (!reports) {
      return [];
    }

    return reports.map(report => ({
      ...report,
      createdAt: report.createdAt.toISOString(),
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}