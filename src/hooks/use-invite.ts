"use client";

import { prepareShareMessage, shareIphoneGiveaway } from "@/services/user-api";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "./use-telegram";
import { errorHandler, notify } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

type InviteType = "general" | "iphone";

export const useInvite = (
  onSuccessHandler?: () => void,
  inviteType: InviteType = "general"
) => {
  const telegram = useTelegram();
  const { user } = useAuth();

  // Select the appropriate endpoint based on inviteType
  const getShareEndpoint = () => {
    switch (inviteType) {
      case "iphone":
        return () => shareIphoneGiveaway("iphone-giveaway");
      case "general":
      default:
        return prepareShareMessage;
    }
  };

  const {
    refetch: prepareShareQuery,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["prepareShare", inviteType],
    queryFn: getShareEndpoint(),
    enabled: false, // Don't fetch automatically
    retry: false, // Don't retry on failure
  });

  // Remove the automatic error handling effect
  // Errors will be handled in handlePrepareShare instead

  const shareMessage = (data: any) => {
    try {
      telegram?.shareMessage(data.prepared_message_id, (success: boolean) => {
        if (success) {
          notify.success("Shared successfully!");
          // Maybe give bonus ticket
          onSuccessHandler?.();
        } else {
          // User cancelled, use fallback share URL
          // notify.failure("You must share to get the prize!");
        }
      });
    } catch (error) {
      try {
        if (typeof window !== "undefined" && user?.game_invite_share_url) {
          try {
            telegram?.openTelegramLink(user.game_invite_share_url);
          } catch {
            console.error(
              "openTelegramLink is not supported or invalid invite link."
            );
          }
        }
      } catch (error) {
        errorHandler(error as any);
      }
    }
  };

  const handlePrepareShare = async () => {
    try {
      const result = await prepareShareQuery();
      console.log(result?.data);
      if (result?.data) {
        shareMessage(result?.data);
      } else if (result?.error) {
        // Handle error only when user triggers the action
        errorHandler(result.error as any);
      }
    } catch (error) {
      errorHandler(error as any);
    }
  };

  const handleInvite = () => {
    if (!telegram) return;

    handlePrepareShare();
  };

  return { handleInvite, isFetching };
};
