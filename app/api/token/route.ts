import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';


export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: 'Please login first' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { token } = body;

    const existingTokenUser = await prisma.user.findFirst({
      where: {
        messengerSecretToken: token,
        NOT: {
          id: currentUser.id,
        },
      },
    });
    
    if (existingTokenUser) {
      return NextResponse.json(
        { message: 'This Messenger Token is already taken. Please generate a different one' },
        { status: 400 }
      );
    }

    const userWithToken = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        messengerSecretToken: true,
      },
    }); 

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        messengerSecretToken: token,
      },
    });

    if (!userWithToken?.messengerSecretToken) {
      return NextResponse.json(
        { message: 'Messenger Token created successfully', updatedUser },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Messenger Token updated successfully', updatedUser },
        { status: 200 },
      );
    } 
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}