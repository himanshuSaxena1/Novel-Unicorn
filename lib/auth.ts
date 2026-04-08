import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { nanoid } from "nanoid";

// ✅ Generate unique username
async function generateUniqueUsername(baseUsername: string) {
  let username = baseUsername;

  let exists = await prisma.user.findUnique({
    where: { username },
  });

  while (exists) {
    username = `${baseUsername}_${nanoid(4)}`;
    exists = await prisma.user.findUnique({
      where: { username },
    });
  }

  return username;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // ✅ fixes OAuthAccountNotLinked
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
            avatar: true,
            coinBalance: true,
          },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? "", // ✅ FIXED
          role: user.role,
          avatar: user.avatar ?? undefined,
          coinBalance: user.coinBalance,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username ?? ""; // ✅ FIXED
        token.coinBalance = user.coinBalance;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
        session.user.coinBalance = token.coinBalance as number;
      }
      return session;
    },

    async signIn() {
      // ✅ DO NOT manually create/update user here
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      const baseUsername =
        user.name?.replace(/\s+/g, "").toLowerCase() ||
        user.email!.split("@")[0];

      const username = await generateUniqueUsername(baseUsername);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          avatar: user.image,
          firstName: user.name?.split(" ")[0],
          lastName: user.name?.split(" ").slice(1).join(" "),
        },
      });
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  debug: process.env.NODE_ENV === "development",
};
