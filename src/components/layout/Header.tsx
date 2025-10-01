"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React from "react";

import { StarIcon } from "@/components/ui/Icon";
import UserProfile from "@/components/ui/UserProfile";
import NavigationConfig from "@/config/routeConfig";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { useUIStore } from "@/stores/useUIStore";
import { useNavbarTheme } from "@/utils/theme";

import AuthModal from "../modals/AuthModal";
import RegistrationModal from "../modals/RegistrationModal";

export const RatingNetLogo = () => {
  const brandConfig = NavigationConfig.getBrandConfig();
  return (
    <StarIcon size={brandConfig.iconSize} className={brandConfig.iconClassName} />
  );
};

export const BrandComponent = () => {
  const brandConfig = NavigationConfig.getBrandConfig();
  return (
    <NavbarBrand>
      <Link href={NavigationConfig.getHomeHref()} className="font-bold text-inherit">
        {brandConfig.name}
      </Link>
      <RatingNetLogo />
    </NavbarBrand>
  );
};

interface UserSectionProps {
  status: "loading" | "authenticated" | "unauthenticated";
  session: { user?: { id?: string; name?: string | null; email?: string | null; image?: string | null; starsCount?: number } } | null;
  isGlobalLoading: boolean;
  onLogout: () => void;
}

const UserSectionDisplay = React.memo(({ status, session, isGlobalLoading, onLogout }: UserSectionProps) => {
  const isLoggedIn = status === "authenticated" && session?.user;
  const isLoading = status === "loading" || isGlobalLoading;

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (isLoggedIn && session?.user) {
    return (
      <UserProfile 
        user={{
          id: session.user.id!,
          name: session.user.name!,
          avatar: session.user.image || undefined,
        }}
        onLogout={onLogout}
      />
    );
  }

  return null;
});

UserSectionDisplay.displayName = 'UserSectionDisplay';


export default function App() {
  const { data: session, status } = useSession({ required: false });
  const isGlobalLoading = useLoadingStore((state) => state.isGlobalLoading);
  const router = useRouter();

  const handleLogout = React.useCallback(async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/login' });
      router.refresh();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      router.refresh();
    }
  }, [router]);
  // Centralized navbar theme - все стили управляются из одного места!
  const { navbarClasses, getLinkClassName, getMobileLinkClassName } = useNavbarTheme();
  
  // Zustand stores с оптимизированными селекторами (подписка только на нужные поля!)
  const isMenuOpen = useUIStore((state) => state.isMenuOpen);
  const isLoginOpen = useUIStore((state) => state.isLoginOpen);
  const isRegistrationOpen = useUIStore((state) => state.isRegistrationOpen);
  
  // Функции тоже через селекторы
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeLogin = useUIStore((state) => state.closeLogin);
  const closeRegistration = useUIStore((state) => state.closeRegistration);
  const switchToLogin = useUIStore((state) => state.switchToLogin);
  const switchToRegistration = useUIStore((state) => state.switchToRegistration);

  const pathName = usePathname();



  return (
    <Navbar 
      className="fixed z-50" 
      isBordered 
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={toggleMenu}
      classNames={navbarClasses}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <BrandComponent />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <NavbarItem>
          <UserSectionDisplay status={status} session={session} isGlobalLoading={isGlobalLoading} onLogout={handleLogout} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="start">
        <BrandComponent />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {NavigationConfig.getMainItemsWithoutLogin().map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link 
              href={item.href}
              className={getLinkClassName(pathName === item.href)}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem>
          <UserSectionDisplay status={status} session={session} isGlobalLoading={isGlobalLoading} onLogout={handleLogout} />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {NavigationConfig.getMainItemsWithoutLogin().map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link 
              href={item.href}
              className={getMobileLinkClassName(pathName === item.href)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <AuthModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin} 
        onOpenRegistration={switchToRegistration}
      />
       <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={closeRegistration} 
        onOpenLogin={switchToLogin}
      />
    </Navbar>
  );
}

