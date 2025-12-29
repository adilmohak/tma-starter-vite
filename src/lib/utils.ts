import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { locales } from "./constants";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Toast helpers
export const notify = {
  loading: (message: string, options?: { timeout?: number }) => {
    toast.loading(message, {
      duration: options?.timeout || 3000,
    });
  },
  success: (message: string, options?: { timeout?: number }) => {
    toast.success(message, {
      duration: options?.timeout || 3000,
    });
  },
  failure: (message: string, options?: { timeout?: number }) => {
    toast.error(message, {
      duration: options?.timeout || 3000,
    });
  },
  info: (message: string, options?: { timeout?: number }) => {
    toast.info(message, {
      duration: options?.timeout || 3000,
    });
  },
  warning: (message: string, options?: { timeout?: number }) => {
    toast.warning(message, {
      duration: options?.timeout || 3000,
    });
  },
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try using the modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch (err) {
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.warn("Copy failed:", err);
    return false;
  }
};

export const signInUser = (token: string) => {
  if (typeof window !== "undefined") {
    return window.localStorage.setItem("access_token", token);
  }
  return 0;
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!window.localStorage.getItem("access_token");
  }
  return false;
};

export const getLocaleName = (langCode: Locale) => {
  try {
    return locales.find((itm) => itm.id === langCode)?.name;
  } catch {
    return "English";
  }
};

export const getUserDisplayName = (user: any) => {
  if (!user) return "";
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) {
    return user.first_name;
  }
  return user.username;
};

// Helper function to remove the language code from the path
const stripLangCode = (path: string) => {
  return path.replace(/^\/[a-z]{2}(\/|$)/, "/");
};

export const isActive = (path: string, pathname: string) => {
  const normalizedPathname = stripLangCode(pathname);
  const normalizedPath = stripLangCode(path);

  if (normalizedPath === "/") {
    return normalizedPathname === "/";
  }
  return normalizedPathname.includes(normalizedPath);
};

export const errorHandler = (error: ApiError, defaultMsg?: string) => {
  const errorData = error.data;
  const msg =
    errorData?.message ??
    errorData?.error ??
    defaultMsg ??
    "Something went wrong. Please try again later!";
  notify.failure(msg);
};

/**
 * Generates a vibrant, consistent color for a user based on their identifier (username/id)
 * @param identifier - The user's username or unique identifier
 * @returns A vibrant hex color string
 */
export function generateUserAvatarColor(identifier: string): string {
  if (!identifier) return "#4f46e5"; // Default darker color if no identifier

  // Create a simple hash from the identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to positive number
  hash = Math.abs(hash);

  // Generate vibrant colors using HSL
  // Use a hue based on the hash, high saturation (70-90%), darker lightness (35-50%) for better contrast with white text
  const hue = hash % 360;
  const saturation = 70 + (hash % 20); // 70-90%
  const lightness = 35 + (hash % 15); // 35-50%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
