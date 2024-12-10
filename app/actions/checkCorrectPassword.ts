import bcrypt from 'bcryptjs';
import { SafeUser } from '../types';


export default async function checkCorrectPassword(user: SafeUser, password: string) {
  if (password === '' || !user?.hashedPassword) {
    return false;
  }

  return bcrypt.compare(password, user?.hashedPassword);
}