import { useEffect, useMemo, useState } from "react";
import { useLanguageStore } from "@/store/language";
import { LOCALE_COOKIE_NAME } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

export function useLanguage(forcedLocale?: string) {
  const { locale, setLocale, t, initializeFromCookie } = useLanguageStore();
  const { user } = useAuth();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize from cookie on mount and prioritize it over user.locale
  useEffect(() => {
    if (typeof document !== "undefined" && !hasInitialized) {
      // Check if there's a cookie first
      const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
        ?.split("=")[1];

      if (cookieLocale) {
        // Cookie exists - use it (this is the most recent user choice)
        initializeFromCookie();
      } else if (user?.locale) {
        // No cookie - use user.locale as fallback
        setLocale(user.locale as Locale);
      }

      setHasInitialized(true);
    }
  }, [initializeFromCookie, setLocale, user?.locale, hasInitialized]);

  // Only update from user.locale if no cookie exists
  useEffect(() => {
    if (hasInitialized && typeof document !== "undefined") {
      const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
        ?.split("=")[1];

      // Only use user.locale if no cookie is present
      if (!cookieLocale && user?.locale && user.locale !== locale) {
        setLocale(user.locale as Locale);
      }
    }
  }, [user?.locale, setLocale, locale, hasInitialized]);

  const translationFunction = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) =>
      t(key, params, forcedLocale);
  }, [t, forcedLocale]);

  return {
    locale: (forcedLocale || locale) as Locale,
    setLocale,
    t: translationFunction,
  };
}
