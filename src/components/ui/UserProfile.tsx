"use client";

import {
  Dropdown,
  DropdownTrigger, 
  DropdownMenu,
  DropdownItem,
  User
} from "@heroui/react";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const handleAction = (key: string) => {
    switch (key) {
      case "logout":
        onLogout();
        break;
      case "settings":
        // TODO: Открыть настройки
        console.log("Открыть настройки");
        break;
      case "profile":
        // TODO: Открыть профиль
        console.log("Открыть профиль");
        break;
      default:
        console.log(`Действие: ${key}`);
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
          }}
          className="transition-transform"
          description={`@${user.email.split('@')[0]}`}
          name={user.name}
        />
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Действия профиля" 
        variant="flat"
        onAction={(key) => handleAction(key as string)}
        classNames={{
          base: "bg-white dark:bg-gray-800 border-none shadow-lg"
        }}
      >
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Вы вошли как</p>
          <p className="font-semibold">{user.email}</p>
        </DropdownItem>
        
        <DropdownItem key="settings">
          Мои настройки
        </DropdownItem>
        
        <DropdownItem key="dashboard">
          Панель управления
        </DropdownItem>
        
        <DropdownItem key="analytics">
          Аналитика
        </DropdownItem>
        
        <DropdownItem key="help">
          Помощь и поддержка
        </DropdownItem>
        
        <DropdownItem key="logout" color="danger">
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
