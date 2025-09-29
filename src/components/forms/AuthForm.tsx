"use client";

import {
  Button,
  Input,
  Divider,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";

import AuthProviders from "@/components/ui/AuthProviders";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/ui/Icons";
import { ThemeAlert } from "@/components/ui/ThemeComponents";
import { authSchema, type AuthFormData } from "@/lib/validations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoadingStore, LOADING_KEYS } from "@/stores/useLoadingStore";
import { useUIStore } from "@/stores/useUIStore";

interface AuthFormProps {
  onClose?: () => void;
  onOpenRegistration?: () => void;
}

export default function AuthForm({ onClose, onOpenRegistration }: AuthFormProps) {
  // Zustand stores
  const { 
    loginResult, 
    setLoginResult, 
    isLoginSubmitting,
    setLoginSubmitting
  } = useAuthStore();
  
  const { 
    setLoading, 
    clearLoading, 
    isLoading 
  } = useLoadingStore();
  
  const { 
    isLoginPasswordVisible, 
    toggleLoginPasswordVisibility 
  } = useUIStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });
  
  const isSubmitting = isLoginSubmitting || isLoading(LOADING_KEYS.AUTH_LOGIN);

  const onSubmit = async (data: AuthFormData) => {
    try {
      // Очищаем предыдущие результаты и устанавливаем загрузку
      setLoginResult(null);
      setLoginSubmitting(true);
      setLoading(LOADING_KEYS.AUTH_LOGIN, true, "Выполняется вход...");
      
      const result = await signIn("credentials", {
        email: data.login,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setLoginResult({
          success: false,
          message: "Неверный email или пароль",
        });
      } else if (result?.ok) {
        setLoginResult({
          success: true,
          message: "Успешный вход в систему!",
        });
        
        // Закрываем модалку через 1 секунду
        setTimeout(() => {
          onClose?.();
          // Перезагружаем страницу чтобы middleware сработал
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setLoginResult({
        success: false,
        message: "Произошла ошибка при входе. Попробуйте позже.",
      });
    } finally {
      // Очищаем состояния загрузки
      setLoginSubmitting(false);
      clearLoading(LOADING_KEYS.AUTH_LOGIN);
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
      {/* Форма входа */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          isClearable
          label="Email"
          placeholder="Введите ваш email"
          type="email"
          variant="bordered"
          isRequired
          isInvalid={!!errors.login}
          errorMessage={errors.login?.message}
          {...register("login")}
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
              onClick={toggleLoginPasswordVisibility}
            >
              {isLoginPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isLoginPasswordVisible ? "text" : "password"}
          {...register("password")}
        />

        <div className="text-right">
          <Button 
            variant="light" 
            color="primary"
            size="sm"
            className="p-0 h-auto text-sm"
          >
            Забыли пароль?
          </Button>
        </div>

        <Button
          color="default"
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Вход..." : "Войти"}
        </Button>

        {/* Отображение результата входа */}
        {loginResult && (
          <ThemeAlert variant={loginResult.success ? "success" : "error"}>
            {loginResult.message}
          </ThemeAlert>
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
          Нет аккаунта?{" "}
        </span>
        <Button 
          variant="light" 
          color="primary"
          size="sm"
          className="p-0 h-auto text-sm font-medium"
          onPress={() => {
            onClose?.(); // Закрываем текущую модалку
            onOpenRegistration?.(); // Открываем модалку регистрации
          }}
        >
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
}