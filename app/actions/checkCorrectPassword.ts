import bcrypt from 'bcryptjs';
import getCurrentUser from './getCurrentUser';
import { SafeUser } from '../types';

interface CheckPasswordProps {
  user?: SafeUser | null | undefined;
  password: string;
}

export default async function checkCorrectPassword(user: SafeUser, password: string) {
  if (password === '' || !user?.hashedPassword) {
    return false;
  }

  return bcrypt.compare(password, user?.hashedPassword);
}