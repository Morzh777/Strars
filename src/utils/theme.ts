// Утилиты для работы с темной темой

/**
 * Генерирует классы для фонов с поддержкой темной темы
 */
export const themeBackground = {
  primary: "bg-white dark:bg-gray-900",
  secondary: "bg-gray-50 dark:bg-gray-800", 
  tertiary: "bg-gray-100 dark:bg-gray-700",
  card: "bg-white dark:bg-gray-800",
  modal: "bg-white dark:bg-gray-900",
  input: "bg-white dark:bg-gray-800",
  button: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
  hover: "hover:bg-gray-50 dark:hover:bg-gray-800"
} as const;

/**
 * Генерирует классы для текста с поддержкой темной темы  
 */
export const themeText = {
  primary: "text-gray-900 dark:text-white",
  secondary: "text-gray-700 dark:text-gray-300", 
  tertiary: "text-gray-600 dark:text-gray-400",
  muted: "text-gray-500 dark:text-gray-400",
  inverse: "text-white dark:text-gray-900",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400"
} as const;

/**
 * Генерирует классы для границ с поддержкой темной темы
 */
export const themeBorder = {
  primary: "border-gray-200 dark:border-gray-800",
  secondary: "border-gray-300 dark:border-gray-600", 
  input: "border-gray-300 dark:border-gray-600",
  card: "border-gray-200 dark:border-gray-800",
  success: "border-green-200 dark:border-green-800",
  error: "border-red-200 dark:border-red-800"
} as const;

/**
 * Полные комбинации стилей для типичных элементов
 */
export const themePresets = {
  // Карточка/контейнер
  card: `${themeBackground.card} ${themeText.primary} ${themeBorder.card} border`,
  
  // Инпуты
  input: `${themeBackground.input} ${themeText.primary} ${themeBorder.input} border`,
  
  // Модальные окна
  modal: `${themeBackground.modal} ${themeText.primary} ${themeBorder.primary} border`,
  
  // Страница/основной контейнер
  page: `${themeBackground.primary} ${themeText.primary} min-h-screen`,
  
  // Навигация
  nav: `${themeBackground.primary} ${themeText.primary} ${themeBorder.primary} border-b`,
  
  // Кнопки
  button: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: `${themeBackground.button} ${themeText.primary}`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-800 ${themeText.primary}`,
    danger: "bg-red-600 hover:bg-red-700 text-white"
  },
  
  // Уведомления/алерты
  alert: {
    success: `bg-green-100 dark:bg-green-900/20 ${themeText.success} ${themeBorder.success} border`,
    error: `bg-red-100 dark:bg-red-900/20 ${themeText.error} ${themeBorder.error} border`,
    warning: `bg-yellow-100 dark:bg-yellow-900/20 ${themeText.warning} border-yellow-200 dark:border-yellow-800 border`,
    info: `bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 border`
  }
} as const;

/**
 * Утилита для объединения theme классов
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Хук для получения theme-aware классов
 */
export function useThemeClasses() {
  return {
    bg: themeBackground,
    text: themeText,
    border: themeBorder,
    preset: themePresets,
    cn
  };
}

// Типы для лучшей типизации
export type ThemeBackground = keyof typeof themeBackground;
export type ThemeText = keyof typeof themeText;
export type ThemeBorder = keyof typeof themeBorder;
export type ThemePreset = keyof typeof themePresets;
