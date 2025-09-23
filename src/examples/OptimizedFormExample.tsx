// Пример того, как можно упростить формы с новыми утилитами

"use client";

import { useState } from "react";
import { Button, Input, Checkbox } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ThemeAlert, ThemeContainer } from "@/components/ui/ThemeComponents";
import { useTheme } from "@/hooks/useTheme";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";

export default function OptimizedFormExample() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { preset, cn } = useTheme();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  // Стили для инпутов теперь в одном месте
  const inputClassNames = {
    input: cn("text-sm", preset.input.split(" ").filter(c => c.includes("text")).join(" ")),
    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
    inputWrapper: cn(preset.input.split(" ").filter(c => c.includes("bg") || c.includes("border")).join(" "))
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Логика отправки формы
    console.log("Form data:", data);
    setResult({ success: true, message: "Форма отправлена успешно!" });
  };

  return (
    <ThemeContainer className="max-w-md mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Все инпуты используют одинаковые стили */}
        <Input
          label="Имя пользователя"
          placeholder="Введите ваше имя"
          variant="bordered"
          isRequired
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          classNames={inputClassNames}
          {...register("name")}
        />

        <Input
          label="Email"
          placeholder="Введите ваш email"
          type="email"
          variant="bordered"
          isRequired
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          classNames={inputClassNames}
          {...register("email")}
        />

        <Input
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          variant="bordered"
          isRequired
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          classNames={inputClassNames}
          {...register("password")}
        />

        <Input
          label="Подтвердите пароль"
          placeholder="Повторите пароль"
          type="password"
          variant="bordered"
          isRequired
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          classNames={inputClassNames}
          {...register("confirmPassword")}
        />

        <div className="space-y-1">
          <Checkbox
            isRequired
            classNames={{
              label: "text-sm text-gray-700 dark:text-gray-300",
              base: "text-sm"
            }}
            {...register("termsAccepted")}
          >
            <span className="text-gray-700 dark:text-gray-300">Я принимаю </span>
            <span className="text-primary cursor-pointer hover:underline">
              условия использования
            </span>
          </Checkbox>
          {errors.termsAccepted && (
            <p className="text-red-500 dark:text-red-400 text-xs">{errors.termsAccepted.message}</p>
          )}
        </div>

        <Button
          color="primary"
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Создание аккаунта..." : "Создать аккаунт"}
        </Button>

        {/* Используем ThemeAlert вместо кастомных стилей */}
        {result && (
          <ThemeAlert variant={result.success ? "success" : "error"}>
            {result.message}
          </ThemeAlert>
        )}
      </form>
    </ThemeContainer>
  );
}

// СРАВНЕНИЕ:
// ДО: 
// className="text-sm text-gray-900 dark:text-white"
// className="text-sm font-medium text-gray-700 dark:text-gray-300"  
// className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"

// ПОСЛЕ:
// classNames={inputClassNames} - переиспользуемый объект
// <ThemeAlert variant="success"> - готовый компонент
// <ThemeContainer> - автоматические стили контейнера
