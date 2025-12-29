// Define supported languages
export const SUPPORTED_LOCALES = ["en", "am", "or", "ti"];
export const DEFAULT_LOCALE = "am";

// Lang codes to their display names mapping
export const LOCALE_NAMES = {
  en: "English",
  am: "Amharic",
  or: "Afaan Oromoo",
  ti: "Tigrinya",
};

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && SUPPORTED_LOCALES.includes(segments[1])) {
    return segments[1];
  }
  return DEFAULT_LOCALE;
}

// Get path without locale
export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && SUPPORTED_LOCALES.includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}
