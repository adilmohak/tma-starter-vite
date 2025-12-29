import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

export function useTelegramTheme() {
  const { setTheme } = useTheme();
  const [telegramTheme, setTelegramTheme] = useState<string>("light");

  // Function to read the --color-scheme CSS variable
  const getTelegramColorScheme = useCallback((): string => {
    if (typeof window === "undefined") return "light";

    try {
      const rootElement = document.documentElement;
      const computedStyle = getComputedStyle(rootElement);
      const colorScheme = computedStyle
        .getPropertyValue("--color-scheme")
        .trim();

      // Default to 'light' if the variable is not set or empty
      return colorScheme || "light";
    } catch (error) {
      console.warn("Failed to read --color-scheme CSS variable:", error);
      return "light";
    }
  }, []);

  // Function to apply theme based on Telegram color scheme
  const applyTelegramTheme = useCallback(() => {
    const tgColorScheme = getTelegramColorScheme();

    // Only update if the theme actually changed
    if (tgColorScheme !== telegramTheme) {
      setTelegramTheme(tgColorScheme);

      // Map Telegram color scheme to next-themes values
      const themeValue = tgColorScheme === "dark" ? "dark" : "light";

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Telegram theme changed: ${tgColorScheme} -> applying ${themeValue} theme`
        );
      }
      setTheme(themeValue);
    }
  }, [getTelegramColorScheme, telegramTheme, setTheme]);

  useEffect(() => {
    // Initial theme application
    applyTelegramTheme();

    // Create a MutationObserver to watch for changes in CSS variables
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" ||
            mutation.attributeName === "class")
        ) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        // Use a small debounce to avoid excessive updates
        setTimeout(applyTelegramTheme, 10);
      }
    });

    // Watch for changes in the document element's attributes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also listen for custom events that might indicate theme changes
    const handleTelegramThemeChange = () => {
      applyTelegramTheme();
    };

    // Listen for potential Telegram Web App theme changes
    window.addEventListener("themeChanged", handleTelegramThemeChange);

    // Additionally, poll for changes every few seconds as a fallback
    const pollInterval = setInterval(() => {
      applyTelegramTheme();
    }, 5000);

    // Cleanup function
    return () => {
      observer.disconnect();
      window.removeEventListener("themeChanged", handleTelegramThemeChange);
      clearInterval(pollInterval);
    };
  }, [applyTelegramTheme]);

  return { telegramTheme };
}
