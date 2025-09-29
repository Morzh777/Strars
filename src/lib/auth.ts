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
            email: user.email,
            name: user.name,
            image: user.image || undefined,
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
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
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
