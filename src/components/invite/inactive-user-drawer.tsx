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
import { getUserDisplayName } from "@/lib/utils";

interface InactiveUserDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  telegram: any;
}

export default function InactiveUserDrawer({
  isOpen,
  onOpenChange,
  selectedUser,
  telegram,
}: InactiveUserDrawerProps) {
  const { t } = useLanguage();

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerCloseButton onClick={() => onOpenChange(false)} />
        <div className="max-w-md w-full mx-auto overflow-auto p-4">
          <DrawerHeader className="flex flex-col gap-4 w-full items-center">
            <div className="h-[64px] w-[64px]">
              <LottiePlayer src="/lottie/pending.json" width={64} height={64} />
            </div>
            <div>
              <DrawerTitle className="text-xl text-center">
                {t("invite.pending_activation")}
              </DrawerTitle>
              <DrawerDescription className="mt-2 text-center max-w-sm text-balance">
                {getUserDisplayName(selectedUser)} {t("pending_description")}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <DrawerFooter className="mt-5">
            {selectedUser?.username ? (
              <Button
                type="button"
                className="w-full bg-button hover:bg-button/80 focus:bg-button/80 text-button-text rounded-xl text-lg capitalize py-6"
                onClick={() => {
                  if (!telegram) return;
                  telegram.openTelegramLink(
                    `https://t.me/${selectedUser?.username}`
                  );
                }}
              >
                {t("remind")}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full bg-button hover:bg-button/80 focus:bg-button/80 text-button-text rounded-xl text-lg capitalize py-6"
                onClick={() => onOpenChange(false)}
              >
                {t("ok")}
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
