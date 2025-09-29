"use client";

import {
  Button,
  Input,
  Divider,
  Checkbox,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "@/app/actions/auth";
import AuthProviders from "@/components/ui/AuthProviders";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/ui/Icons";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoadingStore, LOADING_KEYS } from "@/stores/useLoadingStore";
import { useUIStore } from "@/stores/useUIStore";

interface RegistrationFormProps {
  onClose?: () => void;
  onOpenLogin?: () => void;
}

export default function RegistrationForm({ onClose, onOpenLogin }: RegistrationFormProps) {
  // Zustand stores
  const { 
    registrationResult, 
    setRegistrationResult, 
    isRegistrationSubmitting,
    setRegistrationSubmitting
  } = useAuthStore();
  
  // Очищаем результат при открытии модалки
  React.useEffect(() => {
    setRegistrationResult(null);
  }, [setRegistrationResult]);
  
  const { 
    isRegistrationPasswordVisible, 
    toggleRegistrationPasswordVisibility 
  } = useUIStore();
  
  const { 
    setLoading, 
    clearLoading, 
    isLoading 
  } = useLoadingStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  
  const isSubmitting = isRegistrationSubmitting || isLoading(LOADING_KEYS.AUTH_REGISTER);


  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Очищаем предыдущий результат и устанавливаем загрузку
      setRegistrationResult(null);
      setRegistrationSubmitting(true);
      setLoading(LOADING_KEYS.AUTH_REGISTER, true, "Выполняется регистрация...");
      
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

        // Обновляем статус загрузки
        setLoading(LOADING_KEYS.AUTH_REGISTER, true, "Выполняется автоматический вход...");

        // Автоматически входим в систему
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Успешный автоматический вход
          // Сразу закрываем модалку при успешной регистрации и входе
          onClose?.();
          
          setRegistrationResult({
            success: true,
            message: "Добро пожаловать! Вы успешно зарегистрированы и вошли в систему.",
          });
        } else {
          // Регистрация прошла, но автоматический вход не удался
          // Закрываем модалку через 2 секунды, чтобы пользователь успел прочитать сообщение
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
    } finally {
      // Очищаем состояния загрузки
      setRegistrationSubmitting(false);
      clearLoading(LOADING_KEYS.AUTH_REGISTER);
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
                  isClearable
                  label="Имя пользователя"
                  placeholder="Введите ваше имя"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  {...register("name")}
                />

                <Input
                  isClearable
                  label="Email"
                  placeholder="Введите ваш email"
                  type="email"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register("email")}
                />
                
                <Input
                  label="Пароль"
                  placeholder="Введите пароль"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleRegistrationPasswordVisibility}
                    >
                      {isRegistrationPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isRegistrationPasswordVisible ? "text" : "password"}
                  {...register("password")}
                />
                
                <Input
                  label="Подтвердите пароль"
                  placeholder="Повторите пароль"
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleRegistrationPasswordVisibility}
                    >
                      {isRegistrationPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isRegistrationPasswordVisible ? "text" : "password"}
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
                    onClose?.();
                    onOpenLogin?.(); 
                  }}
                >
                  Войти
                </Button>
              </div>
            </div>
  );
}
