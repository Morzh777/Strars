// app/providers.tsx
"use client";
import {HeroUIProvider} from '@heroui/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
        storageKey="app-theme"
      >
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}