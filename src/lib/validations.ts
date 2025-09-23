import { z } from "zod";

// Схема валидации для формы входа
export const authSchema = z.object({
  login: z
    .string()
    .min(1, "Логин или email обязателен")
    .refine(
      (value) => {
        // Проверяем является ли значение email или логином
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const loginRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return emailRegex.test(value) || loginRegex.test(value);
      },
      {
        message: "Введите корректный email или логин (3-20 символов, только буквы, цифры и _)",
      }
    ),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(50, "Пароль не должен превышать 50 символов"),
});

// Схема валидации для формы регистрации
export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Имя должно содержать минимум 2 символа")
      .max(30, "Имя не должно превышать 30 символов")
      .regex(/^[a-zA-Zа-яА-Я\s]+$/, "Имя должно содержать только буквы и пробелы"),
    email: z
      .string()
      .min(1, "Email обязателен")
      .email("Введите корректный email адрес"),
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(50, "Пароль не должен превышать 50 символов")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру"),
    confirmPassword: z
      .string()
      .min(1, "Подтверждение пароля обязательно"),
    termsAccepted: z
      .boolean()
      .refine((value) => value === true, {
        message: "Необходимо принять условия пользования",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

// Типы для TypeScript
export type AuthFormData = z.infer<typeof authSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
