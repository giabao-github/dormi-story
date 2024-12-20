import { NextResponse } from 'next/server';
import getCurrentUser from '../../actions/getCurrentUser';
import prisma from '../../libs/prismadb';


export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { category, title, description, link } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      console.log("Missing field: ", value);
      NextResponse.error();
    }
  });

  try {
    const event = await prisma.event.create({
      data: {
        category,
        title,
        description,
        link,
        creator: currentUser.name,
        userId: currentUser.id
      }
    });
  
    return NextResponse.json(event);
  } catch (error: any) {
    console.log('Error at /api/event', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}