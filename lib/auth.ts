import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Extend the session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string
      avatar?: string
    } & DefaultSession["user"]
  }

  interface User {
    username?: string
    avatar?: string
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.avatar = user.avatar
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string | undefined
        session.user.avatar = token.avatar as string | undefined
      }
      return session
    },
    async signIn({ user, account }) {
      // For OAuth providers, ensure username is set
      if (account?.provider !== "credentials" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (existingUser && !existingUser.username) {
          // Generate unique username from email
          const baseUsername = user.email.split("@")[0].toLowerCase()
          let username = baseUsername
          let counter = 1

          while (
            await prisma.user.findUnique({
              where: { username },
            })
          ) {
            username = `${baseUsername}${counter}`
            counter++
          }

          await prisma.user.update({
            where: { id: existingUser.id },
            data: { 
              username,
              avatar: user.image || existingUser.avatar,
            },
          })
        }
      }

      return true
    },
  },
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email)
      // TODO: Send welcome email
    },
  },
  debug: process.env.NODE_ENV === "development",
})