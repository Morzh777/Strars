"use client";

import {
  Dropdown,
  DropdownTrigger, 
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  User
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import type { UserProfileProps } from "@/types/User. types";

 

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleAction = (key: string) => {
    switch (key) {
      case "logout":
        onLogout();
        break;
      case "settings":
        // Переход на страницу настроек через Next.js router
        router.push("/settings");
        break;
      case "rating":
        // Переход на страницу рейтинга через Next.js router
        router.push("/rating");
        break;
      case "payments":
        // Переход на страницу истории покупок через Next.js router
        router.push("/payments");
        break;
      case "help":
        // TODO: Открыть помощь
        console.log("Открыть помощь");
        break;
      default:
        console.log(`Действие: ${key}`);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <Dropdown 
      placement="bottom-end"
      classNames={{
        content: "p-0 border-small border-divider bg-background",
      }}
      suppressHydrationWarning
    >
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
          }}
          className="transition-transform"
          name=""
          description=""
          suppressHydrationWarning
        />
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Действия профиля"
        className="p-3"
        variant="flat"
        onAction={(key) => handleAction(key as string)}
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
          ],
        }}
        disabledKeys={["profile"]}
      >
        <DropdownSection showDivider aria-label="Профиль">
          <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
            <div>
              <p className="font-semibold text-default-600">{user.name}</p>
            </div>
          </DropdownItem>
          <DropdownItem key="rating">
            Мой рейтинг
          </DropdownItem>
          <DropdownItem key="payments">
            История покупок
          </DropdownItem>
        </DropdownSection>

        <DropdownSection showDivider aria-label="Настройки">
          <DropdownItem key="settings">
            Мои настройки
          </DropdownItem>
          <DropdownItem
            key="theme"
            isReadOnly
            className="cursor-default"
            endContent={
              <select
                className="z-10 outline-none w-20 py-0.5 rounded-md text-tiny border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                value={theme}
                onChange={handleThemeChange}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="system">Системная</option>
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
              </select>
            }
          >
            Тема
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Помощь">
          <DropdownItem key="help">
            Помощь и поддержка
          </DropdownItem>
          <DropdownItem 
            key="logout" 
            color="danger"
            className="text-danger data-[hover=true]:bg-danger-50 data-[hover=true]:text-danger-500"
          >
            Выйти
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
