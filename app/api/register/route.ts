import bcrypt from 'bcryptjs';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';


const capitalizeName = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const capitalizeEmail = (email: string): string => {
  const [localPart, domainPart] = email.split('@');

  if (!domainPart || !localPart) {
    throw new Error('Invalid student email format');
  }

  const formattedLocalPart = localPart.toUpperCase();
  return `${formattedLocalPart}@${domainPart}`;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, studentId, email, password } = body;

    // Transform the studentId to uppercase and capitalize the name and the email
    const formattedName = capitalizeName(name);
    const formattedId = studentId.toUpperCase();
    const formattedEmail = capitalizeEmail(email);

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: formattedEmail },
          { studentId: studentId.toUpperCase() },
        ],
      },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          name: formattedName,
          studentId: formattedId,
          email: formattedEmail,
          hashedPassword,
        },
      });
      
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
          { message: 'Email or student ID already exists' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

