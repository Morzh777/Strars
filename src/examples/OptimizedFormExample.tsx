// Пример того, как можно упростить формы с новыми утилитами + Zustand

"use client";

import { Button, Input, Checkbox } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ThemeAlert, ThemeContainer } from "@/components/ui/ThemeComponents";
import { useTheme } from "@/hooks/useTheme";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoadingStore, LOADING_KEYS } from "@/stores/useLoadingStore";

export default function OptimizedFormExample() {
  // Zustand stores вместо локального состояния
  const { registrationResult, setRegistrationResult } = useAuthStore();
  const { setLoading, clearLoading, isLoading } = useLoadingStore();
  const { preset, cn } = useTheme();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  // Получаем состояние загрузки
  const isSubmitting = isLoading(LOADING_KEYS.AUTH_REGISTER);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Устанавливаем загрузку через Zustand
      setLoading(LOADING_KEYS.AUTH_REGISTER, true, "Отправляем форму...");
      setRegistrationResult(null);
      
      // Имитация асинхронной отправки
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Form data:", data);
      setRegistrationResult({ 
        success: true, 
        message: "Форма отправлена успешно через Zustand!" 
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setRegistrationResult({ 
        success: false, 
        message: "Ошибка отправки формы" 
      });
    } finally {
      // Очищаем загрузку
      clearLoading(LOADING_KEYS.AUTH_REGISTER);
    }
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

        {/* Используем ThemeAlert с Zustand состоянием */}
        {registrationResult && (
          <ThemeAlert variant={registrationResult.success ? "success" : "error"}>
            {registrationResult.message}
          </ThemeAlert>
        )}
      </form>
    </ThemeContainer>
  );
}

// СРАВНЕНИЕ:
// ДО (useState): 
// const [result, setResult] = useState(null);
// className="text-sm text-gray-900 dark:text-white"
// formState: { errors, isSubmitting }

// ПОСЛЕ (Zustand + Theme Utils):
// const { registrationResult, setRegistrationResult } = useAuthStore();
// const { setLoading, clearLoading, isLoading } = useLoadingStore();
// classNames={inputClassNames} - переиспользуемый объект
// <ThemeAlert variant="success"> - готовый компонент с Zustand
// <ThemeContainer> - автоматические стили контейнера
// Глобальное состояние загрузки через LOADING_KEYS
