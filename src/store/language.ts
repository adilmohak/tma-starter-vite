import { create } from "zustand";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { LOCALE_COOKIE_NAME, COOKIE_EXPIRY_DAYS } from "@/lib/constants";
import { translations } from "@/lib/i18n/translations";

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
  t: (
    key: string,
    params?: Record<string, string | number>,
    forcedLocale?: string
  ) => string;
  initializeFromCookie: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: DEFAULT_LOCALE,

  setLocale: (newLocale: string) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      console.error(`Locale ${newLocale} is not supported`);
      return;
    }

    set({ locale: newLocale });

    // Persist to cookie
    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=${
        60 * 60 * 24 * COOKIE_EXPIRY_DAYS
      }`;
    }
  },

  t: (
    key: string,
    params?: Record<string, string | number>,
    forcedLocale?: string
  ): string => {
    const { locale } = get();
    const activeLocale = forcedLocale || locale;
    const localeTranslations = translations[activeLocale] || {};
    let translation =
      localeTranslations[key] || translations[DEFAULT_LOCALE]?.[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(
          new RegExp(`\\{${paramKey}\\}`, "g"),
          String(paramValue)
        );
      });
    }

    return translation;
  },

  initializeFromCookie: () => {
    if (typeof document !== "undefined") {
      const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
        ?.split("=")[1];

      if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
        const { locale: currentLocale } = get();
        // Only update if the locale has actually changed
        if (currentLocale !== cookieLocale) {
          set({ locale: cookieLocale });
        }
      }
    }
  },
}));
