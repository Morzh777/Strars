"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { registrationSchema } from "@/lib/validations";
import prisma from "@/utils/prisma";

// Создаем схему без confirmPassword и termsAccepted для server action
const serverRegistrationSchema = registrationSchema.omit({ 
  confirmPassword: true, 
  termsAccepted: true 
});

type ServerRegistrationData = z.infer<typeof serverRegistrationSchema>;

export interface RegistrationResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerUser(data: ServerRegistrationData): Promise<RegistrationResult> {
  try {
    // Валидируем данные на стороне сервера
    const validatedData = serverRegistrationSchema.parse(data);

    // Проверяем, не существует ли уже пользователь с таким email
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
