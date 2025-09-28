"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { registrationSchema, authSchema } from "@/lib/validations";
import prisma from "@/utils/prisma";

// Создаем схему без confirmPassword и termsAccepted для server action
const serverRegistrationSchema = registrationSchema.omit({ 
  confirmPassword: true, 
  termsAccepted: true 
});

type ServerRegistrationData = z.infer<typeof serverRegistrationSchema>;
type LoginData = z.infer<typeof authSchema>;

export interface RegistrationResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export async function registerUser(data: ServerRegistrationData): Promise<RegistrationResult> {
  try {
    const validatedData = serverRegistrationSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Пользователь с таким email уже существует",
      };
    }

    // Хэшируем пароль
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Создаем пользователя в базе данных
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name.trim(),
        email: validatedData.email.toLowerCase().trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      message: "Пользователь успешно зарегистрирован!",
      user: newUser,
    };

  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);

    // Обработка ошибок валидации Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Некорректные данные: " + error.issues.map((e) => e.message).join(", "),
      };
    }

    // Обработка ошибок Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          message: "Пользователь с таким email уже существует",
        };
      }
    }

    return {
      success: false,
      message: "Произошла ошибка при регистрации. Попробуйте позже.",
    };
  }
}

export async function loginUser(data: LoginData): Promise<LoginResult> {
  try {
    const validatedData = authSchema.parse(data);

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.login.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Неверный email или пароль",
      };
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Неверный email или пароль",
      };
    }

    return {
      success: true,
      message: "Успешный вход в систему!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || undefined,
      },
    };

  } catch (error) {
    console.error("Ошибка при входе:", error);

    // Обработка ошибок валидации Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Некорректные данные: " + error.issues.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message: "Произошла ошибка при входе. Попробуйте позже.",
    };
  }
}

export async function logoutUser(): Promise<void> {
  // В будущем здесь можно добавить логику очистки сессий, токенов и т.д.
  console.log("Пользователь вышел из системы");
}
