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
    coins: 3300,
    subtitle: "Perfect for Regulars",
    description:
      "Ideal for frequent readers to enjoy a variety of premium stories and features.",
  },
  {
    id: "gold",
    name: "Gold",
    price: 49.99,
    coins: 5500,
    subtitle: "Ideal for Enthusiasts",
    description:
      "Great for avid readers who want extended access to exclusive content and bonuses.",
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 99.99,
    coins: 12000,
    subtitle: "Ultimate Experience",
    description:
      "The best choice for power users with unlimited access to all premium content and perks.",
  },
];

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = typeof date === "string" ? new Date(date) : date;

  // Ensure the date is valid
  if (isNaN(past.getTime())) {
    return "Invalid date";
  }

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Check each interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  // Less than a minute
  return seconds <= 0
    ? "Just now"
    : `${seconds} second${seconds === 1 ? "" : "s"} ago`;
}

export function generateTeaser(content: string | null, maxChars: number = 700) {
  if (!content) return null;

  return content.length > maxChars
    ? content.slice(0, maxChars).trimEnd() + "..."
    : content;
}