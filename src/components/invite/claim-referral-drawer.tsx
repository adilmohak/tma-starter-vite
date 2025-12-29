"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerCloseButton,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import LottiePlayer from "@/components/lottie-player";
import { useLanguage } from "@/hooks/use-language";

interface ClaimReferralDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleClaimReferral: () => void;
  isLoading: boolean;
}

export default function ClaimReferralDrawer({
  isOpen,
  onOpenChange,
  handleClaimReferral,
  isLoading,
}: ClaimReferralDrawerProps) {
  const { t } = useLanguage();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerCloseButton onClick={() => onOpenChange(false)} />
        <div className="max-w-md w-full mx-auto overflow-auto p-4">
          <DrawerHeader className="flex flex-col gap-8 w-full">
            <div>
              <span className="inline-block mx-auto">
                <LottiePlayer
                  src="/lottie/wallet.lottie"
                  width={60}
                  height={60}
                />
              </span>
              <DrawerTitle className="mt-3">{t("claim_to_wallet")}</DrawerTitle>
              <DrawerDescription className="px-3 mx-auto mt-2">
                {t("claim_description")}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              type="button"
              className="mt-5 w-full bg-button hover:bg-button/80 focus:bg-button/80 text-button-text rounded-xl text-lg capitalize py-6 disabled:bg-slate-300 disabled:bg-opacity-25"
              onClick={handleClaimReferral}
              disabled={isLoading}
            >
              {isLoading ? t("processing") : t("claim_now")}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
