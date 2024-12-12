import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { compileReportTemplate, sendEmail } from '@/app/libs/mail';

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

  const send = async () => {
    "use server"
    await sendEmail({ 
      to: 'silverbullet2609@gmail.com', 
      name: currentUser?.name || 'Anonymous User', 
      subject: `Violation Report from ${currentUser.name}`,
      body: compileReportTemplate(process.env.SMTP_USERNAME || '', 'http://localhost:3100', currentUser.name, currentUser.email || '', currentUser.studentId, category, time, location, description, proofSrc)
    });
  }

  send();
  return NextResponse.json(report);
}