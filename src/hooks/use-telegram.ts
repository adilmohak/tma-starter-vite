import { useEffect, useState } from "react";

export const useTelegram = () => {
  const [telegram, setTelegram] = useState<WebApp | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.expand();
      setTelegram(tg);
    }
  }, []);

  return telegram;
};
