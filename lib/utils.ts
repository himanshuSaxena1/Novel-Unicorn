import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}