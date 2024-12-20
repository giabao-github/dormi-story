import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { category, title, introduction, content, files, sources, tags } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  try {
    const article = await prisma.article.create({
      data: {
        category,
        title,
        introduction,
        content,
        files, 
        sources, 
        tags,
        author: currentUser.name,
        userId: currentUser.id
      }
    });

    return NextResponse.json(article);
  } catch (error: any) {
    console.log('Error at /api/article:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}