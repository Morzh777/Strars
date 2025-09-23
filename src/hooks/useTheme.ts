"use client";

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn, themeBackground, themeBorder, themePresets, themeText } from '@/utils/theme';

/**
 * Расширенный хук для работы с темами
 */
export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Получить актуальную тему (с учетом системной)
  // Используем безопасное значение по умолчанию для SSR
  const currentTheme = mounted ? (resolvedTheme || theme) : undefined;
  const isDark = mounted ? currentTheme === 'dark' : false;

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    currentTheme,
    isDark,
    mounted,
    // Утилиты для классов
    bg: themeBackground,
    text: themeText,
    border: themeBorder,
    preset: themePresets,
    cn,
    // Быстрые переключения
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
    setSystem: () => setTheme('system')
  };
}

/**
 * Хук для создания theme-aware классов с условиями
 */
export function useThemeClassNames() {
  const { isDark, cn } = useTheme();

  /**
   * Создает условные классы в зависимости от темы
   */
  const themeClass = (lightClass: string, darkClass: string) => {
    return isDark ? darkClass : lightClass;
  };

  /**
   * Создает объект с классами для light/dark режимов
   */
  const themeClasses = (classes: { light: string; dark: string }) => {
    return isDark ? classes.dark : classes.light;
  };

  return {
    isDark,
    cn,
    themeClass,
    themeClasses,
    // Готовые наборы для частых случаев
    pageClasses: cn(themePresets.page),
    cardClasses: cn(themePresets.card),
    inputClasses: cn(themePresets.input),
    modalClasses: cn(themePresets.modal)
  };
}
