import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { category, title, description, link } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      console.log('Missing field: ', value);
      NextResponse.error();
    }
  });

  try {
    const survey = await prisma.survey.create({
      data: {
        category,
        title,
        description,
        link,
        creator: currentUser.name,
        userId: currentUser.id
      }
    });
  
    return NextResponse.json(survey);
  } catch (error: any) {
    console.log('Error at /api/survey:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}