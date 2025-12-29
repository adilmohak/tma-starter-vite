"use client";

import { cn, isActive } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useTelegram } from "@/hooks/use-telegram";
import { Link } from "next-view-transitions";
import { Link2Icon, User2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { IconHome } from "@tabler/icons-react";

const BottomNavigation = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const telegram = useTelegram();

  const vibrateOnClick = () => {
    telegram?.HapticFeedback.impactOccurred("medium");
  };

  return (
    <footer className="fixed bottom-0 left-0 safe-area-padding-bottom bg-muted w-full border-t min-h-[72px] z-[2]">
      <div className="h-[72px] max-w-[var(--layout-max-width)] mx-auto grid grid-cols-3 w-full">
        <Button
          type="button"
          variant="ghost"
          className="group flex flex-col h-auto pt-2 w-full rounded-none focus:bg-transparent hover:bg-transparent"
          asChild
        >
          <Link
            href="/invite"
            className="flex flex-col"
            onClick={vibrateOnClick}
          >
            <span
              className={cn(
                "size-[35px] min-w-[35px] flex items-center justify-center rounded-full bg-muted-light",
                isActive("/invite", pathname) ? "bg-accent" : ""
              )}
            >
              <Link2Icon
                className={cn(
                  "fill-muted-light stroke-hint",
                  isActive("/invite", pathname) &&
                    "fill-button stroke-button-text"
                )}
              />
            </span>
            <span
              className={cn(
                "capitalize text-[0.65rem] text-secondary",
                isActive("/invite", pathname) && "text-accent"
              )}
            >
              {t("general.footer.invite")}
            </span>
          </Link>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="group flex flex-col h-auto pt-2 w-full rounded-none focus:bg-transparent hover:bg-transparent"
          asChild
        >
          <Link href="/" className="flex flex-col" onClick={vibrateOnClick}>
            <span
              className={cn(
                "size-[35px] min-w-[35px] flex items-center justify-center rounded-full bg-muted-light",
                isActive("/", pathname) ? "bg-accent" : ""
              )}
            >
              <IconHome
                size={20}
                className={cn(
                  "fill-muted-light stroke-hint",
                  isActive("/", pathname) && "fill-button stroke-button-text"
                )}
              />
            </span>
            <span
              className={cn(
                "capitalize text-[0.65rem] text-secondary",
                isActive("/", pathname) && "text-accent"
              )}
            >
              Home
            </span>
          </Link>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="group flex flex-col h-auto py-2 w-full rounded-none focus:bg-transparent hover:bg-transparent"
          asChild
        >
          <Link
            href="/profile"
            className="flex flex-col"
            onClick={vibrateOnClick}
          >
            <span
              className={cn(
                "size-[35px] min-w-[35px] flex items-center justify-center rounded-full bg-muted-light",
                isActive("/profile", pathname) ? "bg-accent" : ""
              )}
            >
              <User2
                className={cn(
                  "fill-muted-light stroke-hint",
                  isActive("/profile", pathname) &&
                    "fill-button stroke-button-text"
                )}
              />
            </span>

            <span
              className={cn(
                "capitalize text-[0.65rem] text-secondary",
                isActive("/profile", pathname) && "text-accent"
              )}
            >
              {t("general.footer.profile")}
            </span>
          </Link>
        </Button>
      </div>
    </footer>
  );
};

export default BottomNavigation;
