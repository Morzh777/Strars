"use client";
import { useEffect, useState } from 'react';

interface NoSSRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Компонент-обертка для элементов, которые должны рендериться только на клиенте
 * Помогает избежать проблем с гидратацией для theme-зависимых компонентов
 */
export function NoSSRWrapper({ children, fallback = null }: NoSSRWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default NoSSRWrapper;
