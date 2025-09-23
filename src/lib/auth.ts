import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { authSchema } from "@/lib/validations";
import prisma from "@/utils/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Валидируем входные данные
          const { login, password } = authSchema.parse({
            login: credentials?.email,
            password: credentials?.password,
          });

          // Ищем пользователя в базе данных
          const user = await prisma.user.findUnique({
            where: { email: login.toLowerCase() }
          });

          if (!user) {
            console.error("Пользователь не найден:", login);
            return null;
          }

          // Проверяем пароль
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Неверный пароль для пользователя:", login);
            return null;
          }

          // Возвращаем данные пользователя
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
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  pages: {
    signIn: "/", // Переопределяем страницу входа на главную (у нас модальные окна)
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS только в production
      },
    },
    callbackUrl: { 
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax", 
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
