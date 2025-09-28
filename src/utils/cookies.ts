/**
 * Утилиты для работы с cookies
 */

/**
 * Очищает cookie по имени
 */
export function clearCookie(name: string, path: string = "/"): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Очищает все токены авторизации
 */
export function clearAuthCookies(): void {
  const authCookies = [
    "auth.session-token",
    "auth.csrf-token", 
    "auth.callback-url"
  ];
  
  authCookies.forEach(cookieName => {
    clearCookie(cookieName);
  });
  
  console.log("Все токены авторизации очищены");
}

/**
 * Проверяет существование cookie
 */
export function hasCookie(name: string): boolean {
  return document.cookie
    .split(';')
    .some(cookie => cookie.trim().startsWith(`${name}=`));
}

/**
 * Получает значение cookie по имени
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}
