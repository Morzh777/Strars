import React from 'react';

import { cn, themePresets } from '@/utils/theme';

// Базовые пропы для всех компонентов
interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Контейнер страницы с автоматической темной темой
 */
export function ThemePage({ children, className }: BaseProps) {
  return (
    <div className={cn(themePresets.page, className)}>
      {children}
    </div>
  );
}

/**
 * Карточка с автоматической темной темой
 */
export function ThemeCard({ children, className }: BaseProps) {
  return (
    <div className={cn(themePresets.card, "rounded-lg p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

/**
 * Контейнер для контента с автоматической темной темой
 */
export function ThemeContainer({ children, className }: BaseProps) {
  return (
    <div className={cn(themePresets.card, "p-6", className)}>
      {children}
    </div>
  );
}

/**
 * Заголовки с автоматической темной темой
 */
export function ThemeHeading({ children, className, level = 1 }: BaseProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold", 
    3: "text-xl font-semibold",
    4: "text-lg font-medium",
    5: "text-base font-medium",
    6: "text-sm font-medium"
  };
  
  return (
    <Tag className={cn("text-gray-900 dark:text-white", sizeClasses[level], className)}>
      {children}
    </Tag>
  );
}

/**
 * Параграф с автоматической темной темой
 */
export function ThemeText({ children, className, variant = "primary" }: BaseProps & { 
  variant?: "primary" | "secondary" | "muted" 
}) {
  const variantClasses = {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-600 dark:text-gray-400"
  };
  
  return (
    <p className={cn(variantClasses[variant], className)}>
      {children}
    </p>
  );
}

/**
 * Алерт с автоматической темной темой
 */
export function ThemeAlert({ children, className, variant = "info" }: BaseProps & { 
  variant?: "success" | "error" | "warning" | "info" 
}) {
  return (
    <div className={cn(themePresets.alert[variant], "p-3 rounded-lg text-sm", className)}>
      {children}
    </div>
  );
}

/**
 * Секция/раздел с автоматической темной темой
 */
export function ThemeSection({ children, className }: BaseProps) {
  return (
    <section className={cn("bg-white dark:bg-gray-900 text-gray-900 dark:text-white", className)}>
      {children}
    </section>
  );
}
