import { useThemeStore } from "@/store/theme-store";

/**
 * Custom hook to access theme functionality
 * Provides easy access to current theme and theme changing function
 */
export const useCustomTheme = () => {
  const { currentTheme, setTheme, applyTheme } = useThemeStore();

  return {
    currentTheme,
    setTheme,
    applyTheme,
  };
};
