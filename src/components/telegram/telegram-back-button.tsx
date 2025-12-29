"use client";

import { useTelegram } from "@/hooks/use-telegram";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface TelegramBackButtonProps {
  onClickHandler?: () => void;
  back?: boolean;
  disabled?: boolean;
}

const TelegramBackButton: React.FC<TelegramBackButtonProps> = ({
  onClickHandler,
  back,
  disabled = false,
}) => {
  const router = useRouter();
  const telegram = useTelegram();
  const currentHandlerRef = useRef<(() => void) | undefined>(undefined);
  const isSetupRef = useRef(false);

  useEffect(() => {
    if (!telegram || disabled) return;

    const { BackButton } = telegram;

    const clickHandler = () => {
      if (onClickHandler) {
        onClickHandler();
      } else if (back) {
        router.back();
      } else {
        router.replace("/");
      }
    };

    if (currentHandlerRef.current) {
      BackButton.offClick(currentHandlerRef.current);
    }

    if (!isSetupRef.current) {
      BackButton.show();
      isSetupRef.current = true;
    }

    BackButton.onClick(clickHandler);
    currentHandlerRef.current = clickHandler;

    return () => {
      if (currentHandlerRef.current) {
        BackButton.offClick(currentHandlerRef.current);
        currentHandlerRef.current = undefined;
      }
      BackButton.hide();
      isSetupRef.current = false;
    };
  }, [telegram, router, onClickHandler, back, disabled]);

  return null;
};

export default TelegramBackButton;

