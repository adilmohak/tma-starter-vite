import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useTelegram } from "@/hooks/use-telegram";

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface TelegramFullscreenContextType {
  isMobileDevice: boolean;
  insets: SafeAreaInsets;
  isFullscreen: boolean;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  platform: string;
}

const TelegramFullscreenContext = createContext<
  TelegramFullscreenContextType | undefined
>(undefined);

interface TelegramFullscreenProviderProps {
  children: ReactNode;
}

export function TelegramFullscreenProvider({
  children,
}: TelegramFullscreenProviderProps) {
  const telegram = useTelegram();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [isAddedToHomeScreen, setIsAddedToHomeScreen] = useState(false);
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    // Check if the method exists and if the WebApp version supports it
    if (
      !telegram ||
      typeof telegram?.checkHomeScreenStatus === "undefined" ||
      !telegram.version ||
      parseFloat(telegram.version) < 6.1 // checkHomeScreenStatus requires version 6.1+
    ) {
      return;
    }

    try {
      telegram.checkHomeScreenStatus(
        (status: "missed" | "added" | "unknown" | "unsupported") => {
          console.log("Home screen status:", status);
          if (status === "missed") {
            telegram.addToHomeScreen();
          }
        }
      );
    } catch (error) {
      console.warn(
        "checkHomeScreenStatus not supported in this Telegram version",
        error
      );
    }
  }, [telegram]);

  // Centralized fullscreen request handler
  const requestFullscreen = () => {
    // Check if the method exists and if the WebApp version supports it
    if (
      !telegram ||
      typeof telegram?.requestFullscreen === "undefined" ||
      !telegram.version ||
      parseFloat(telegram.version) < 6.1 // requestFullscreen requires version 6.1+
    ) {
      console.log("requestFullscreen not supported in this Telegram version");
      return;
    }

    try {
      telegram.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.warn(
        "requestFullscreen not supported in this Telegram version",
        error
      );
    }
  };

  // Centralized fullscreen exit handler
  const exitFullscreen = () => {
    // Check if the method exists and if the WebApp version supports it
    if (
      !telegram ||
      typeof telegram?.exitFullscreen === "undefined" ||
      !telegram.version ||
      parseFloat(telegram.version) < 6.1 // exitFullscreen requires version 6.1+
    ) {
      console.log("exitFullscreen not supported in this Telegram version");
      return;
    }

    try {
      telegram.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  };

  useEffect(() => {
    if (!telegram) return;

    // Check if we're on a mobile device (not desktop)
    const isDesktop =
      telegram.platform === "unknown" ||
      telegram.platform === "tdesktop" ||
      telegram.platform === "web" ||
      telegram.platform === "macos" ||
      telegram.platform === "linux";

    const isMobile = !isDesktop;
    setIsMobileDevice(isMobile);

    // Check current fullscreen state
    setIsFullscreen(telegram.isFullscreen || false);

    // Request fullscreen for mobile devices automatically
    // Auto-request fullscreen if supported and not already in fullscreen
    if (
      // isMobile &&
      !telegram.isFullscreen &&
      typeof telegram.requestFullscreen === "function" &&
      telegram.version &&
      parseFloat(telegram.version) >= 6.1 // Only request fullscreen if version supports it
    ) {
      requestFullscreen();
    }

    // Set content safe area insets
    if (telegram.contentSafeAreaInset) {
      try {
        setInsets(telegram.contentSafeAreaInset);
      } catch (error) {
        console.error("Error setting content safe area insets:", error);
      }
    }

    // Cleanup function - only exit fullscreen if we're on mobile
    // Desktop/web should maintain their state
    return () => {
      if (
        // isMobile &&
        telegram.isFullscreen &&
        typeof telegram.exitFullscreen === "function"
      ) {
        try {
          telegram.exitFullscreen();
          setIsFullscreen(false);
        } catch (error) {
          console.error("Error exiting fullscreen:", error);
        }
      }
    };
  }, [telegram]);

  const value = {
    isMobileDevice,
    insets,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    platform: telegram?.platform || "unknown",
  };

  return (
    <TelegramFullscreenContext.Provider value={value}>
      {children}
    </TelegramFullscreenContext.Provider>
  );
}

export function useTelegramFullscreen() {
  const context = useContext(TelegramFullscreenContext);
  if (context === undefined) {
    throw new Error(
      "useTelegramFullscreenContext must be used within a TelegramFullscreenProvider"
    );
  }
  return context;
}
