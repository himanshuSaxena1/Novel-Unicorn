import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
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

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar ?? undefined,
          coinBalance: user.coinBalance,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      try {
        if (user) {
          token.role = user.role;
          token.username = user.username;
          token.coinBalance = user.coinBalance;
          token.sub = user.id;
        }
        if (account && trigger === "signIn") {
          token.provider = account.provider;
          token.providerAccountId = account.providerAccountId;
        } else {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { coinBalance: true },
          });
          if (user) {
            token.coinBalance = user.coinBalance;
          }
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.sub!;
          session.user.role = token.role as UserRole;
          session.user.username = token.username as string;
          session.user.coinBalance = token.coinBalance as number;
        }
      } catch (error) {
        console.error("Session Callback Error:", error);
      }
      return session;
    },
    async signIn({ user, account, profile, email }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }, // Include existing accounts
          });

          if (existingUser) {
            // Check if the Google account is already linked
            const existingAccount = existingUser.accounts.find(
              (acc) =>
                acc.provider === account.provider &&
                acc.providerAccountId === account.providerAccountId
            );
            if (!existingAccount) {
              // Link the new Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  id_token: account.id_token,
                  scope: account.scope,
                },
              });
            }
          } else {
            // Create new user and link the Google account
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username:
                  user.name?.replace(/\s+/g, "").toLowerCase() ||
                  user.email!.split("@")[0],
                firstName: user.name?.split(" ")[0],
                lastName: user.name?.split(" ").slice(1).join(" "),
                avatar: user.image,
                role: "USER",
                emailVerified: new Date(),
                coinBalance: 0,
              },
            });

            // Create the Account record for the new user
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                id_token: account.id_token,
                scope: account.scope,
              },
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
