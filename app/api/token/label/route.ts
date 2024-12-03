import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';


export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: 'Unauthenticated' },
      { status: 401 }
    );
  }

  try {
    const userWithToken = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        messengerSecretToken: true,
      },
    }); 


    if (!userWithToken?.messengerSecretToken) {
      return NextResponse.json(
        { message: 'Create' },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Update' },
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