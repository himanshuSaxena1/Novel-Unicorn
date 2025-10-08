import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar ?? undefined,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                username: user.name?.replace(/\s+/g, '').toLowerCase() || user.email!.split('@')[0],
                firstName: user.name?.split(' ')[0],
                lastName: user.name?.split(' ').slice(1).join(' '),
                avatar: user.image,
                role: 'USER',
                emailVerified: new Date()
              }
            })
          }
        } catch (error) {
          console.error('Error creating user:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}