import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import TelegramBackButton from "./telegram-back-button";
import { isActive } from "@/lib/utils";
import { useShowEmbeddedView, useDrawerState } from "@/store/ui-store";
import { useTelegram } from "@/hooks/use-telegram";

/**
 * Centralized Back Button Handler
 *
 * Manages the Telegram back button behavior across the entire app.
 * Priority order when handling back button clicks:
 *
 * 1. Close top drawer (if any drawers are open) - uses LIFO
 * 2. Close embedded game view (if a game is open)
 * 3. Navigate back or close app (depending on current page)
 */
const BackButtonHandler = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { webViewUrl, setWebViewUrl } = useShowEmbeddedView();
  const { closeTopDrawer, openDrawers } = useDrawerState();
  const telegram = useTelegram();

  const onClickHandler = useCallback(() => {
    if (openDrawers.length > 0 && closeTopDrawer()) {
      return;
    }

    if (webViewUrl) {
      setWebViewUrl(null);
      return;
    }

    if (isActive("/", pathname)) {
      telegram?.close();
    } else {
      navigate(-1);
    }
  }, [
    closeTopDrawer,
    openDrawers.length,
    webViewUrl,
    setWebViewUrl,
    pathname,
    telegram,
    navigate,
  ]);

  return <TelegramBackButton onClickHandler={onClickHandler} />;
};

export default BackButtonHandler;
