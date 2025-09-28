"use client";

import { Spinner } from "@heroui/spinner";

import { useLoadingStore } from "@/stores/useLoadingStore";

export default function GlobalLoader() {
  const { isGlobalLoading, globalLoadingMessage } = useLoadingStore();

  if (!isGlobalLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-bg-main) 50%, transparent)",
      }}
    >
      <Spinner
        size="lg"
        color="primary"
        label={globalLoadingMessage || "Загрузка"}
      />
    </div>
  );
}
