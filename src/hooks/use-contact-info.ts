"use client";

import { updateUserPhone } from "@/services/user-api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTelegram } from "./use-telegram";
import { useAuth } from "@/context/auth-context";

export const useContactInfo = (onSuccessHandler?: () => void) => {
  const telegram = useTelegram();
  const { user, refetchUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(user?.phone);

  const updateUserPhoneMutation = useMutation({
    mutationKey: ["updateUserPhoneMutation"],
    mutationFn: updateUserPhone,
    onSuccess: () => {
      refetchUser(); // refetch to get latest user information. Fixes re-requesting contact info
      onSuccessHandler?.();
    },
    onError: () => {
      refetchUser(); // refetch anyway because once the user shares its contact the bot/backend will receive it, so we get latest data
    },
  });

  // accept optional callback
  const shareContactInfo = (callback?: (phoneNumber: string) => void) => {
    if (user && user?.phone) {
      setPhoneNumber(user.phone);
      return;
    }

    if (!telegram?.requestContact) return;

    if (user && !user?.phone) {
      try {
        telegram?.requestContact((success: boolean, response: any) => {
          if (success) {
            console.log("Request phone", response);
            const telegramUserPhoneNumber =
              response.responseUnsafe?.contact?.phone_number;
            console.log("telegramUserPhoneNumber", telegramUserPhoneNumber);
            setPhoneNumber(telegramUserPhoneNumber);
            updateUserPhoneMutation.mutate({ phone: phoneNumber });
            callback?.(telegramUserPhoneNumber);
          }
        });
      } catch {
        console.error("requestContact is not supported in this context.");
      }
    }
  };

  // Request user contact info
  useEffect(() => {
    shareContactInfo();
  }, [user, telegram]);

  return { phoneNumber, setPhoneNumber, shareContactInfo };
};
