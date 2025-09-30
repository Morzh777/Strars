import type { NavbarItem } from '@/types/navigation';

class NavigationConfig {
  private static readonly ROUTES = {
    HOME: "/",
    PROFILE: "/profile",
    RATING: "/rating",
    PAYMENTS: "/payments",
    LOGIN: "/login",
  } as const;

  private static readonly DESCRIPTION = {
    PROFILE: "Мой профиль",
    RATING: "Мой рейтинг",
    PAYMENTS: "История покупок",
    LOGIN: "Вход",
    HOME: "Главная",
  } as const;

  private static readonly menuItems: NavbarItem[] = [
    {
      label: this.DESCRIPTION.LOGIN,
      href: this.ROUTES.LOGIN,
    },
  ];
  // Получить href главной страницы
  static getHomeHref(): string {
    return this.ROUTES.HOME;
  }
  // Получить все пункты меню
  static getAllItems(): NavbarItem[] {
    return this.menuItems;
  }

  // Получить пункты меню без "Вход" 
  static getMainItemsWithoutLogin(): NavbarItem[] {
    return this.menuItems.filter((item) => item.href !== this.ROUTES.LOGIN);
  }
  // Получить только пункт "Вход"
  static getLoginItem(): NavbarItem | undefined {
    return this.menuItems.find((item) => item.href === this.ROUTES.LOGIN);
  }
  // Получить первые N пунктов меню
  static getFirstItems(count: number): NavbarItem[] {
    return this.menuItems.slice(0, count);
  }



  // Получить все роуты
  static getRoutes() {
    return this.ROUTES;
  }

  // Получить конфигурацию бренда
  static getBrandConfig() {
    return {
      name: "STAR",
      iconSize: 25,
      iconClassName: "text-yellow-500",
    } as const;
  }
}

export default NavigationConfig;
