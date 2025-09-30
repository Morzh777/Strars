// app/providers.tsx
"use client";
import {HeroUIProvider} from '@heroui/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export function Providers({children, session}: { children: React.ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
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