"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useTelegramTheme } from "@/hooks/use-telegram-theme";
import { initializeTheme } from "@/store/theme-store";

interface CustomThemeProviderProps
  extends Omit<ThemeProviderProps, "defaultTheme" | "enableSystem"> {
  children: React.ReactNode;
}

function TelegramThemeController({ children }: { children: React.ReactNode }) {
  // This component handles the Telegram theme logic
  useTelegramTheme();

  // Initialize our custom theme system
  React.useEffect(() => {
    initializeTheme();
  }, []);

  return <>{children}</>;
}

export function ThemeProvider({
  children,
  ...props
}: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <TelegramThemeController>{children}</TelegramThemeController>
    </NextThemesProvider>
  );
}
