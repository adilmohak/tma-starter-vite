import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeOption = "cold" | "warm";

interface ThemeState {
  currentTheme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  applyTheme: (theme: ThemeOption) => void;
}

// Theme configurations
export const themeConfigs = {
  warm: {
    name: "Warm",
    colors: {
      background: "0 0% 13%", // Dark brown/golden background
      primary: "45 25% 92%", // Warm white text
      secondary: "40 12% 50%",
      muted: "0 0% 16%", // Darker golden brown
      "muted-light": "38 22% 22%",
      header: "32 18% 14%",
      hint: "40 15% 52%",
      border: "240 5% 22%",
      link: "45 85% 65%", // Golden link
      accent: "45 100% 55%", // Bright golden accent
      "accent-dark-900": "45 100% 35%",
      "accent-dark-700": "45 100% 42%",
      "accent-dark": "45 100% 48%",
      button: "45 100% 55%",
      "button-opacity": "45 100% 55% / 0.1",
      "button-text": "30 25% 15%",
    },
  },
  cold: {
    name: "Cold",
    colors: {
      background: "210 30% 13%", // Dark blue-gray
      primary: "0 0% 96%", // Light text
      secondary: "206 9% 52%",
      muted: "214 26% 19%",
      "muted-light": "214 27% 24%",
      header: "211 27% 15%",
      hint: "210 12% 55%",
      border: "213 26% 22%",
      link: "205 69% 63%",
      accent: "43 100% 61%", // Yellow/orange accent
      "accent-dark-900": "43 100% 41%",
      "accent-dark-700": "43 100% 47%",
      "accent-dark": "43 100% 51%",
      button: "43 100% 61%",
      "button-opacity": "43 100% 61% / 0.1",
      "button-text": "214 23% 18%",
    },
  },
} as const;

// Default theme identifier
export const DEFAULT_THEME: ThemeOption = "cold";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: DEFAULT_THEME,
      setTheme: (theme: ThemeOption) => {
        set({ currentTheme: theme });
        get().applyTheme(theme);
      },
      applyTheme: (theme: ThemeOption) => {
        if (typeof window === "undefined") return;

        const config = themeConfigs[theme];
        const root = document.documentElement;

        // Apply all color variables
        Object.entries(config.colors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });

        // Store theme preference
        localStorage.setItem("ZEMA-THEME", theme);

        if (process.env.NODE_ENV === "development") {
          console.log(`Applied ${config.name} theme`);
        }
      },
    }),
    {
      name: "ZEMA-THEME-STORAGE",
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
);

// Initialize theme on app start
export const initializeTheme = () => {
  if (typeof window === "undefined") return;

  const store = useThemeStore.getState();
  const savedTheme = localStorage.getItem("ZEMA-THEME") as ThemeOption;

  if (savedTheme && themeConfigs[savedTheme]) {
    store.setTheme(savedTheme);
  } else {
    store.applyTheme(store.currentTheme);
  }
};
