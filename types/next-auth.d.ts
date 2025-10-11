import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client"; // Import UserRole enum if needed

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: UserRole;
      avatar?: string;
      coinBalance: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    avatar?: string;
    coinBalance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role: UserRole;
    username: string;
    coinBalance: number;
  }
}
