"use client";

import {
  Button,
  Input,
  Divider,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import AuthProviders from "@/components/ui/AuthProviders";
import { ThemeAlert } from "@/components/ui/ThemeComponents";
import { authSchema, type AuthFormData } from "@/lib/validations";

interface AuthFormProps {
  onClose?: () => void;
  onOpenRegistration?: () => void;
}

export default function AuthForm({ onClose, onOpenRegistration }: AuthFormProps) {
  const [loginResult, setLoginResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setLoginResult(null);
      
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
        }, 1000);
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setLoginResult({
        success: false,
        message: "Произошла ошибка при входе. Попробуйте позже.",
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
      {/* Форма входа */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Логин или Email"
          placeholder="Введите логин или email"
          variant="bordered"
          isRequired
          isInvalid={!!errors.login}
          errorMessage={errors.login?.message}
          classNames={{
            input: "text-sm text-gray-900 dark:text-white",
            label: "text-sm font-medium text-gray-700 dark:text-gray-300",
            inputWrapper: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          }}
          {...register("login")}
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
          color="primary"
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