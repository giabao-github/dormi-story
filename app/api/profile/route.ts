import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: image,
        name: name
      }
    });

    await prisma.article.updateMany({
      where: {
        userId: currentUser.id,
      },
      data: {
        author: name,
      },
    });

    await prisma.report.updateMany({
      where: {
        userId: currentUser.id,
      },
      data: {
        reporterName: name,
      },
    });

    await prisma.survey.updateMany({
      where: {
        userId: currentUser.id,
      },
      data: {
        creator: name,
      },
    });

    await prisma.event.updateMany({
      where: {
        userId: currentUser.id,
      },
      data: {
        creator: name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.log('Error at /api/profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}