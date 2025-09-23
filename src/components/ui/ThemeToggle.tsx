"use client";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Icon } from "./Icon";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Показываем placeholder пока компонент не смонтирован
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        className="text-default-500"
        isDisabled
      >
        <Icon name="moon" size={20} />
      </Button>
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="text-default-500"
      aria-label={`Переключить на ${currentTheme === "dark" ? "светлую" : "темную"} тему`}
    >
      {currentTheme === "dark" ? (
        <Icon name="sun" size={20} />
      ) : (
        <Icon name="moon" size={20} />
      )}
    </Button>
  );
}
