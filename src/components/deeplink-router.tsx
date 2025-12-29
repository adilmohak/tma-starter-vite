"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegram } from "@/hooks/use-telegram";

interface DeeplinkRouterProps {
  children: React.ReactNode;
  onRoutingComplete?: () => void;
}

/**
 * Utility function to determine the target route based on startApp parameter
 */
const getTargetRoute = (
  startApp: string,
  currentPathname: string
): string | null => {
  if (!startApp) return null;

  // Game prefix to game name mapping
  const GAME_PREFIX_MAP: Record<string, string> = {
    coupon_: "coupon",
    adey_: "adey",
    aviator_: "aviator",
    aviamasters_: "aviamasters",
    turbo_keno_: "turbo-keno",
    fast_keno_: "fast-keno",
    fish_road_: "fish-road",
    keno_: "keno",
    roulette_: "mini-roulette",
    mines_: "mines",
    plinko_: "plinko",
    chicken_roast_: "chicken-roast",
    chicken_: "chicken-road",
    fast_bingo_: "fast-bingo",
    mini_roulette_: "mini-roulette",
    "3_kings_scratch_": "3-kings-scratch",
    rocket_dice_: "rocket-dice",
    fortune_spin_: "fortune-spin",
    zema_plinko_: "zema-plinko",
    mine_gems_: "mine-gems",
    rabbit_road_: "rabbit-road",
  };

  // Check game prefix mappings
  for (const [prefix, gameName] of Object.entries(GAME_PREFIX_MAP)) {
    if (startApp.startsWith(prefix)) {
      // Redirect directly to the game page
      return `/${gameName}`;
    }
  }

  // https://t.me/SafarigamesbetaBot/play?startapp=giftbox_iphone-giveaway_392957340

  if (startApp.startsWith("giftbox_")) {
    // const entries = startApp.split("_");
    // if (entries.length >= 2) {
    return `/iphone`;
    // }
    // return null;
  }

  if (startApp.startsWith("battle_")) {
    const entries = startApp.split("_");
    if (entries.length >= 3) {
      localStorage.setItem("battleReferralCode", entries[entries.length - 1]);
    }
    return `/battles/${startApp.split("_")[1]}`;
  }

  if (startApp.startsWith("jgv_")) {
    const entries = startApp.split("_");
    localStorage.setItem("giveawayReferralCode", startApp);
    return `/giveaways/${entries[1]}`;
  }

  if (startApp.startsWith("iphone_")) {
    // const entries = startApp.split("_");
    return `/iphone`;
  }

  if (startApp.startsWith("giveawayClaim_")) {
    const entries = startApp.split("_");
    return `/giveaways/${entries[1]}/claim`;
  }

  if (startApp.startsWith("raffle_")) {
    return `/raffle`;
  }

  if (startApp.startsWith("contest_")) {
    return `/leaderboard`;
  }

  if (startApp.startsWith("giveaway_")) {
    return `/giveaways/${startApp.split("_")[1]}`;
  }

  if (startApp.startsWith("spin_")) {
    return `/spin`;
  }

  // Handle specific static routes
  switch (startApp) {
    case "page_game":
      return "/";
    case "invite_":
      return "/invite";
    case "game_aviator":
      return "/aviator";
    case "game_jackpot":
      return "/jackpot";
    case "giveaways":
      return "/giveaways";
    case "rocket":
      return "/rocket";
    case "iphone":
      return "/iphone";
    default:
      return null;
  }
};

const DeeplinkRouter: React.FC<DeeplinkRouterProps> = ({
  children,
  onRoutingComplete,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasProcessedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  const telegram = useTelegram();

  let startApp = telegram?.initDataUnsafe?.start_param || null;
  const isBackupBot = startApp?.startsWith("hulugame_bot__");
  if (startApp && isBackupBot) {
    startApp = startApp.split("__")[1];
  }

  useEffect(() => {
    if (!telegram) return;

    // Check if we've already processed this startApp parameter in this session
    const sessionKey = startApp ? `startApp_processed_${startApp}` : null;
    const hasProcessedInSession = sessionKey
      ? sessionStorage.getItem(sessionKey) === "true"
      : false;

    // Only process if we have a startApp and haven't processed it yet
    if (startApp && !hasProcessedRef.current && !hasProcessedInSession) {
      hasProcessedRef.current = true;

      // Mark as processed in session storage to prevent re-processing after navigation
      if (sessionKey) {
        sessionStorage.setItem(sessionKey, "true");
      }

      const targetRoute = getTargetRoute(startApp, pathname);

      if (targetRoute && targetRoute !== pathname) {
        // Navigate to the target route
        console.log("Redirecting to:", targetRoute);
        router.push(targetRoute);
      }
    }

    // Allow rendering after processing or if no redirect is needed
    console.log("Rendering children");
    setShouldRender(true);
  }, [telegram, startApp, pathname, router]);

  // Separate effect to handle routing completion notification
  useEffect(() => {
    if (shouldRender) {
      console.log("Routing complete");
      onRoutingComplete?.();
    }
  }, [shouldRender, onRoutingComplete]);

  // Don't render children until routing decision is made
  if (!shouldRender && telegram && !hasProcessedRef.current) {
    return null; // Provider will handle loading state
  }

  return <>{children}</>;
};

export default DeeplinkRouter;
