export const locales = ["en", "am", "or", "ti"] as const;
export const defaultLocale = "am";

export type Locale = (typeof locales)[number];
