export const LOCALE_COOKIE_NAME = "user-locale";
export const COOKIE_EXPIRY_DAYS = 30;

export const paymentMethods = [
  {
    id: "telebirr",
    name: "telebirr",
    image: "/payment-methods/telebirr.jpg",
  },
  {
    id: "cbebirr",
    name: "CBE-Birr",
    image: "/payment-methods/cbe-birr.jpg",
  },
  {
    id: "mpessa",
    name: "M-PESSA",
    image: "/payment-methods/m-pessa.png",
  },
];

export const BG_COLOR = "bg-[#f7b82b]";
export const BG_COLOR_HEX = "#f7b82b";

export const GIVEAWAY_COLORS = {
  airtime: "bg-[#f7b82b]",
  cash: "bg-[#00bb52]",
};

export const GIVEAWAY_COLORS_HEX = {
  airtime: "#f7b82b",
  cash: "#00bb52",
};

// Feature toggles - Easy configuration for enabling/disabling features
export const FEATURE_FLAGS = {
  // Withdrawal Toggle: Set to true to enable withdrawals, false to disable
  // When disabled, users will see a pause message and cannot withdraw
  WITHDRAWALS_ENABLED: true,
  DEPOSITS_ENABLED: true,
};

// Notification Popup Configuration
export const NOTIFICATION_CONFIG = {
  // Time window for showing the notification (24-hour format)
  START_HOUR: 6, // 6:00 AM
  END_HOUR: 12, // 11:00 AM

  // Bonus amount to show in the notification
  BONUS_AMOUNT: 100,

  // Maximum number of times to show the notification per day
  MAX_DAILY_SHOWS: 1,

  // Local storage keys for tracking notification display
  STORAGE_KEY: "last_notification_shown",
  COUNT_STORAGE_KEY: "notification_show_count",

  // Notification content
  TITLE: "🌅 Morning Bonus Available!",
  MESSAGE: "Deposit now and get an extra 100 ETB bonus until 9:00 AM",
  BUTTON_TEXT: "Claim Bonus",
};

export const isDevelopment = import.meta.env.VITE_ENV === "development" || import.meta.env.DEV;

export const locales = isDevelopment
  ? [
      { name: "English", id: "en", icon: "🇬🇧" },
      { name: "አማርኛ", id: "am", icon: "🇪🇹" },
      { name: "Afaan Oromoo", id: "or", icon: "🇪🇹" },
      { name: "ትግርኛ", id: "ti", icon: "🇪🇹" },
    ]
  : [
      { name: "English", id: "en", icon: "🇬🇧" },
      { name: "አማርኛ", id: "am", icon: "🇪🇹" },
      { name: "ትግርኛ", id: "ti", icon: "🇪🇹" },
    ];

export const SUPPORT_BOT = "ZemaSupportBot";
