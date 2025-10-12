import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type Package = {
  id: string;
  name: string;
  price: number;
  coins: number;
  subtitle?: string;
  description?: string;
};

export const PACKAGES: Package[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 9.99,
    coins: 1000,
    subtitle: "Great for Starters",
    description:
      "Perfect for new users to explore premium chapters and unlock basic content.",
  },
  {
    id: "silver",
    name: "Silver",
    price: 29.99,
    coins: 3000,
    subtitle: "Perfect for Regulars",
    description:
      "Ideal for frequent readers to enjoy a variety of premium stories and features.",
  },
  {
    id: "gold",
    name: "Gold",
    price: 49.99,
    coins: 5100,
    subtitle: "Ideal for Enthusiasts",
    description:
      "Great for avid readers who want extended access to exclusive content and bonuses.",
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 99.99,
    coins: 11000,
    subtitle: "Ultimate Experience",
    description:
      "The best choice for power users with unlimited access to all premium content and perks.",
  },
];
