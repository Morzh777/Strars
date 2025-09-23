"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React from "react";

import { StarIcon } from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import UserProfile from "@/components/ui/UserProfile";
import NavigationConfig from "@/config/routeConfig";

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
      <Link className="font-bold text-inherit" href={NavigationConfig.getHomeHref()}>{brandConfig.name}</Link>
      <RatingNetLogo />
    </NavbarBrand>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const pathName = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Стили для кнопки входа
  const loginButtonStyles = "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800";

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const isLoggedIn = status === "authenticated" && session?.user;
  const isLoading = status === "loading";



  return (
    <Navbar 
      className="fixed z-50" 
      isBordered 
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        wrapper: "bg-white dark:bg-gray-900",
        content: "text-gray-900 dark:text-white",
        brand: "text-gray-900 dark:text-white",
        item: "text-gray-700 dark:text-gray-300",
        toggle: "text-gray-700 dark:text-gray-300",
        menu: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <BrandComponent />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          {isLoading ? (
            // Красивый skeleton в форме UserProfile
            <div className="flex items-center gap-3 p-2">
              {/* Круглый аватар skeleton */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              
              {/* Текстовые линии для имени и email */}
              <div className="flex flex-col gap-1">
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ) : isLoggedIn && session?.user ? (
            <UserProfile 
              user={{
                id: session.user.id!,
                name: session.user.name!,
                email: session.user.email!,
                avatar: session.user.image || undefined,
              }}
              onLogout={handleLogout}
            />
          ) : (
            <Button 
              variant="bordered" 
              onPress={() => setIsLoginOpen(true)}
              className={loginButtonStyles}
            >
              {NavigationConfig.getLoginItem()?.label}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="start">
        <BrandComponent />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {NavigationConfig.getMainItemsWithoutLoginAndLogout().map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link color={isMounted && pathName === item.href ? "primary" : "foreground"} href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          {isLoading ? (
            // Красивый skeleton в форме UserProfile
            <div className="flex items-center gap-3 p-2">
              {/* Круглый аватар skeleton */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              
              {/* Текстовые линии для имени и email */}
              <div className="flex flex-col gap-1">
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ) : isLoggedIn && session?.user ? (
            <UserProfile 
              user={{
                id: session.user.id!,
                name: session.user.name!,
                email: session.user.email!,
                avatar: session.user.image || undefined,
              }}
              onLogout={handleLogout}
            />
          ) : (
            <Button 
              variant="bordered" 
              onPress={() => setIsLoginOpen(true)}
              className={loginButtonStyles}
            >
              Войти
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {NavigationConfig.getMainItemsWithoutLogin().map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full"
              color={
                isMounted && pathName === item.href ? "primary" :
                NavigationConfig.isLogoutPath(item.href) ? "danger" : "foreground"
              }
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <AuthModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onOpenRegistration={() => setIsRegistrationOpen(true)}
      />
       <RegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
        onOpenLogin={() => setIsLoginOpen(true)}
      />
    </Navbar>
  );
}

