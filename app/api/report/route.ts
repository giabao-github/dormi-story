import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { category, time, location, description, proofSrc } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const report = await prisma.report.create({
    data: {
      category,
      time,
      location,
      description,
      proofSrc,
      reporterName: currentUser.name,
      reporterStudentId: currentUser.studentId,
      userId: currentUser.id
    }
  });

  return NextResponse.json(report);
}