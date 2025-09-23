"use client";

import { Button } from "@heroui/react";

import { Icon } from "./Icon";

interface AuthProvidersProps {
  onProviderAuth: (provider: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Компонент круглых кнопок для авторизации через внешние провайдеры
 */
export default function AuthProviders({ onProviderAuth, isLoading = false }: AuthProvidersProps) {
  const providers = [
    {
      name: "Telegram",
      icon: "telegram",
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      enabled: true,
      label: "Войти через Telegram"
    },
    {
      name: "Google", 
      icon: "google",
      className: "bg-white hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700",
      enabled: false,
      label: "Войти через Google (скоро)"
    },
    {
      name: "Mail.ru",
      icon: "mailru", 
      className: "bg-white hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700",
      enabled: false,
      label: "Войти через Mail.ru (скоро)"
    }
  ];

  return (
    <div className="flex justify-center gap-4">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          isIconOnly
          variant="flat"
          size="lg"
          className={`w-14 h-14 rounded-full ${provider.className}`}
          onPress={() => provider.enabled && onProviderAuth(provider.name)}
          isLoading={isLoading && provider.enabled}
          isDisabled={!provider.enabled}
          aria-label={provider.label}
        >
          <Icon name={provider.icon as "telegram" | "google" | "mailru"} size={24} />
        </Button>
      ))}
    </div>
  );
}
