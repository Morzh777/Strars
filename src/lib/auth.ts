import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authSchema } from "@/lib/validations";
import prisma from "@/utils/prisma";

const nextAuth = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: `csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: `callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { login, password } = authSchema.parse({
            login: credentials?.email,
            password: credentials?.password,
          });

          const user = await prisma.user.findUnique({
            where: { email: login.toLowerCase() }
          });

          if (!user) {
            console.error("Пользователь не найден:", login);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Неверный пароль для пользователя:", login);
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            image: user.image || undefined,
            starsCount: user.starsCount || 0,
          };
        } catch (error) {
          console.error("Произошла ошибка при авторизации:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.starsCount = (user as { starsCount?: number }).starsCount;
      }
      return token;
    },
    async session({ session, token }) {
      // Only expose minimal user fields; keep default next-auth fields optional
      session.user = {
        id: String(token.id),
        starsCount: (token.starsCount as number) || 0,
        name: session.user?.name,
        image: session.user?.image,
      } as typeof session.user;
      return session;
    },
  },
  events: {
    async signOut(message) {
      // Событие при выходе - можно добавить логирование
      console.log("SignOut event:", message);
    },
  },
  pages: {
    signIn: '/login', // Перенаправляем на страницу логина
  },
});

// Экспортируем handlers, auth, signIn, signOut из NextAuth v5
export const { handlers, auth, signIn, signOut } = nextAuth;
