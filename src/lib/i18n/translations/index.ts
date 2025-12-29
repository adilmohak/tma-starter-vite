import { referralTranslations } from "./referral";
import { generalTranslations } from "./general";
import { profileTranslations } from "./profile";

export type Translations = Record<string, Record<string, string>>;

// Helper function to merge translations
const mergeTranslations = (
  ...translationSets: Translations[]
): Translations => {
  const result: Translations = {};

  // Initialize result object with supported locales
  ["en", "am", "or", "ti"].forEach((locale) => {
    result[locale] = {};
  });

  // Merge all translation sets
  translationSets.forEach((translationSet) => {
    Object.entries(translationSet).forEach(([locale, translations]) => {
      result[locale] = { ...result[locale], ...translations };
    });
  });

  return result;
};

// Export the merged translations
export const translations = mergeTranslations(
  referralTranslations,
  generalTranslations,
  profileTranslations
);
