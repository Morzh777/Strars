import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import {Providers} from "@/app/providers";
import GlobalLoader from "@/components/ui/GlobalLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stars - социальная сеть",
  description: "Покажи всем свою индивидуальность",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Темная тема по умолчанию
                if (localStorage.getItem('app-theme') === 'light') {
                  document.documentElement.classList.remove('dark')
                } else {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-theme-main text-theme-main transition-colors duration-300`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <GlobalLoader />
        </Providers>
      </body>
    </html>
  );
}
