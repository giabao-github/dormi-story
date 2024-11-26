import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions, Awaitable } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import prisma from '@/app/libs/prismadb';


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialProvider({
      name: 'credentials',
      credentials: {
        studentId: { label: 'studentId', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Credentials received: ', credentials);
        if (!credentials?.studentId || !credentials?.password) {
          throw new Error('Invalid credentials 1');
        }

        const user = await prisma.user.findUnique({
          where: {
            studentId: credentials.studentId.toUpperCase(),
          }
        });
        console.log('Database user:', user);

        if (!user || !user?.hashedPassword) {
          console.log('No user found or missing hashed password');
          throw new Error('Invalid credentials 2');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isCorrectPassword) {
          console.log('Incorrect password');
          throw new Error('Incorrect password');
        }

        console.log('User authenticated successfully:', user);
        return user;
      }
    })
  ],
  pages: {
    signIn: '/',
    error: '/'
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl;
    },
  }
};

export default NextAuth(authOptions);