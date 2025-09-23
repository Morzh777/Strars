"use client";

import {
  Button,
  Input,
  Divider,
  Checkbox,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerUser, type RegistrationResult } from "@/app/actions/auth";
import AuthProviders from "@/components/ui/AuthProviders";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";

interface RegistrationFormProps {
  onClose?: () => void;
  onOpenLogin?: () => void;
}

export default function RegistrationForm({ onClose, onOpenLogin }: RegistrationFormProps) {
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange", // Валидация при изменении
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });


  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Очищаем предыдущий результат
      setRegistrationResult(null);
      
      // Вызываем server action для регистрации
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        // Показываем сообщение об успешной регистрации
        setRegistrationResult({
          success: true,
          message: "Регистрация прошла успешно! Выполняется автоматический вход...",
        });

        // Автоматически входим в систему
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Успешный автоматический вход
          setRegistrationResult({
            success: true,
            message: "Добро пожаловать! Вы успешно зарегистрированы и вошли в систему.",
          });
          
          // Закрываем модалку через 1.5 секунды
          setTimeout(() => {
            onClose?.();
          }, 1500);
        } else {
          // Регистрация прошла, но автоматический вход не удался
          setRegistrationResult({
            success: true,
            message: "Регистрация прошла успешно! Войдите в систему используя свои данные.",
          });
          
          setTimeout(() => {
            onClose?.();
          }, 2000);
        }
      } else {
        // Ошибка регистрации
        setRegistrationResult(result);
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setRegistrationResult({
        success: false,
        message: "Произошла неожиданная ошибка. Попробуйте позже.",
      });
    }
  };

  const handleProviderAuth = async (provider: string) => {
    try {
      console.log(`Авторизация через ${provider}`);
      
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose?.();
    } catch (error) {
      console.error(`Ошибка авторизации через ${provider}:`, error);
    }
  };

  return (
    <div className="space-y-6">
              {/* Форма регистрации */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Имя пользователя"
                  placeholder="Введите ваше имя"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  classNames={{
                    input: "text-sm text-gray-900 dark:text-white",
                    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    inputWrapper: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }}
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
                  classNames={{
                    input: "text-sm text-gray-900 dark:text-white",
                    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    inputWrapper: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }}
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
                  classNames={{
                    input: "text-sm text-gray-900 dark:text-white",
                    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    inputWrapper: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }}
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
                  classNames={{
                    input: "text-sm text-gray-900 dark:text-white",
                    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                    inputWrapper: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }}
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
                    <span className="text-gray-700 dark:text-gray-300">Я принимаю{" "}</span>
                    <span className="text-primary cursor-pointer hover:underline">
                      условия использования
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{" "}и{" "}</span>
                    <span className="text-primary cursor-pointer hover:underline">
                      политику конфиденциальности
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

                {/* Отображение результата регистрации */}
                {registrationResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    registrationResult.success 
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800" 
                      : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}>
                    {registrationResult.message}
                  </div>
                )}
              </form>

              <div className="flex items-center gap-4">
                <Divider className="flex-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">или войти через</span>
                <Divider className="flex-1" />
              </div>

              {/* Провайдеры авторизации */}
              <AuthProviders 
                onProviderAuth={handleProviderAuth} 
                isLoading={isSubmitting} 
              />

              <div className="text-center pt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Уже есть аккаунт?{" "}
                </span>
                <Button 
                  variant="light" 
                  color="primary"
                  size="sm"
                  className="p-0 h-auto text-sm font-medium"
                  onPress={() => {
                    onClose?.(); // Закрываем текущую модалку
                    onOpenLogin?.(); // Открываем модалку входа
                  }}
                >
                  Войти
                </Button>
              </div>
            </div>
  );
}
