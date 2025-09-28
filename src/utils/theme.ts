// Утилиты для работы с темной темой

/**
 * Генерирует классы для фонов с поддержкой темной темы
 */
export const themeBackground = {
  primary: "bg-theme-main",
  secondary: "bg-theme-secondary", 
  tertiary: "bg-gray-100 dark:bg-gray-800",
  card: "bg-theme-card",
  modal: "bg-theme-main",
  input: "bg-theme-card",
  button: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
  hover: "hover:bg-gray-50 hover:dark:bg-theme-secondary"
} as const;

/**
 * Генерирует классы для текста с поддержкой темной темы  
 */
export const themeText = {
  primary: "text-theme-main",
  secondary: "text-theme-secondary", 
  tertiary: "text-theme-muted",
  muted: "text-theme-muted",
  inverse: "text-white dark:text-gray-900",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400"
} as const;

/**
 * Генерирует классы для границ с поддержкой темной темы
 */
export const themeBorder = {
  primary: "border-theme-main",
  secondary: "border-theme-secondary", 
  input: "border-theme-secondary",
  card: "border-theme-main",
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
  
  // Navbar компоненты
  navbar: {
    base: themeBackground.primary,
    wrapper: themeBackground.primary,
    content: themeText.primary,
    brand: themeText.primary,
    item: themeText.secondary,
    toggle: themeText.secondary,
    menu: `${themeBackground.primary} ${themeBorder.primary}`,
    menuBorder: themeBorder.primary
  },
  
  // Навигационные ссылки
  navLink: {
    active: "text-blue-600 dark:text-blue-400 hover:opacity-80",
    inactive: "text-gray-700 dark:text-gray-300 hover:opacity-80",
    danger: "text-red-600 dark:text-red-400 hover:opacity-80",
    base: "relative inline-flex items-center tap-highlight-transparent outline-none transition-opacity"
  },
  
  // Кнопки
  button: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: `${themeBackground.button} ${themeText.primary}`,
    ghost: `hover:bg-gray-100 dark:hover:bg-gray-800 ${themeText.primary}`,
    danger: "bg-red-600 hover:bg-red-700 text-white",
    login: "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
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
    navbar: themePresets.navbar,
    navLink: themePresets.navLink,
    cn
  };
}

/**
 * Специальный хук для Header/Navbar - полный контроль всех стилей
 */
export function useNavbarTheme() {
  return {
    // Классы для HeroUI Navbar
    navbarClasses: {
      base: cn(themeBackground.primary, themeBorder.primary),
      wrapper: themeBackground.primary,
      content: themeText.primary,
      brand: themeText.primary,
      item: themeText.secondary,
      toggle: themeText.secondary,
      menu: cn(themeBackground.primary, themeBorder.primary)
    },
    
    // Функция для получения стилей ссылки
    getLinkClassName: (isActive: boolean) => cn(
      themePresets.navLink.base,
      isActive ? themePresets.navLink.active : themePresets.navLink.inactive
    ),
    
    // Функция для получения стилей мобильной ссылки
    getMobileLinkClassName: (isActive: boolean) => cn(
      themePresets.navLink.base,
      "w-full text-lg",
      isActive ? themePresets.navLink.active : themePresets.navLink.inactive
    ),
    
    // Стили кнопки входа
    loginButtonClassName: themePresets.button.login,
    
    // Утилиты
    cn
  };
}

// Типы для лучшей типизации
export type ThemeBackground = keyof typeof themeBackground;
export type ThemeText = keyof typeof themeText;
export type ThemeBorder = keyof typeof themeBorder;
export type ThemePreset = keyof typeof themePresets;
