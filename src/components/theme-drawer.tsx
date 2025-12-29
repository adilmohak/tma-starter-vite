"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CheckCircle2, Palette } from "lucide-react";
import {
  useThemeStore,
  themeConfigs,
  type ThemeOption,
  DEFAULT_THEME,
} from "@/store/theme-store";
import { cn } from "@/lib/utils";
import ButtonBase from "./ui/button-base";
import { useLanguage } from "@/hooks/use-language";

interface ThemeDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ThemeDrawer({ open, setOpen }: ThemeDrawerProps) {
  const { currentTheme, setTheme } = useThemeStore();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create stable close handler
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Simulated theme change handler
  const handleChangeTheme = (theme: ThemeOption) => {
    setIsSubmitting(true);
    setTheme(theme);
    // Simulate API delay
    setTimeout(() => {
      console.log("Theme changed to:", theme);
      handleClose();
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-[300px]">
        <DrawerCloseButton onClick={handleClose} />

        <div className="mx-auto w-full max-w-sm pt-5 pb-5">
          <DrawerHeader className="flex flex-col items-center gap-2">
            <span className="bg-violet-500 rounded-xl size-[45px] flex items-center justify-center">
              <Palette size={30} className="fill-white text-violet-500" />
            </span>
            <DrawerTitle>{t("profile.theme.title")}</DrawerTitle>
            <DrawerDescription>
              {t("profile.theme.description")}
            </DrawerDescription>

            <div className="grid grid-cols-2 gap-6 my-10">
              {(
                Object.entries(themeConfigs) as [
                  ThemeOption,
                  (typeof themeConfigs)[ThemeOption]
                ][]
              ).map(([themeKey, config]) => (
                <div key={themeKey}>
                  <ButtonBase
                    onClick={() => handleChangeTheme(themeKey)}
                    className={cn(
                      "relative w-32 h-40 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105",
                      themeKey === "cold" &&
                        "bg-[hsl(210_30%_13%)] border-[hsl(213_26%_22%)]",
                      themeKey === "warm" &&
                        "bg-[hsl(0_0%_13%)] border-[hsl(240_5%_22%)]",
                      currentTheme === themeKey && "border-accent scale-105"
                    )}
                  >
                    {currentTheme === themeKey && (
                      <div className="absolute top-1 right-1 z-10">
                        <CheckCircle2
                          size={18}
                          className="text-background fill-[hsl(43_100%_61%)]"
                        />
                      </div>
                    )}
                    <div className="flex gap-1 items-center">
                      <div
                        className={cn(
                          "h-6 w-16 rounded-xl",
                          themeKey === "cold" && "bg-[hsl(214_26%_19%)]",
                          themeKey === "warm" && "bg-[hsl(0_0%_16%)]"
                        )}
                      />
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full",
                          themeKey === "cold" && "bg-[hsl(214_26%_19%)]",
                          themeKey === "warm" && "bg-[hsl(0_0%_16%)]"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "h-8 w-24 rounded-xl",
                        themeKey === "cold" && "bg-[hsl(214_26%_19%)]",
                        themeKey === "warm" && "bg-[hsl(0_0%_16%)]"
                      )}
                    />
                    <div
                      className={cn(
                        "h-8 w-16 rounded-xl",
                        themeKey === "cold" && "bg-[hsl(214_26%_19%)]",
                        themeKey === "warm" && "bg-[hsl(0_0%_16%)]"
                      )}
                    />
                  </ButtonBase>
                  <p className="text-center text-secondary ms-2 mt-2 text-sm">
                    {t(`profile.theme.${themeKey}`)}
                    {themeKey === DEFAULT_THEME && " (Default)"}
                  </p>
                </div>
              ))}
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleClose} className="w-full">
              {t("profile.theme.close")}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
