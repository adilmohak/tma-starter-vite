"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  claimCoupon,
  claimSpinCoupon,
  claimCrashTicket,
  claimIphoneCoupon,
} from "@/services/user-api";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LottiePlayer from "@/components/lottie-player";
import { useShowFirework } from "@/store/ui-store";
import { useContactInfo } from "@/hooks/use-contact-info";
import { errorHandler, notify } from "@/lib/utils";

type CouponType = "coupon" | "spin" | "crash" | "iphone";

interface CouponDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: CouponType;
  onClaim?: (data?: any) => void;
}

export default function CouponDrawer({
  open,
  setOpen,
  type = "coupon",
  onClaim,
}: CouponDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { phoneNumber, shareContactInfo } = useContactInfo();
  const { setShowFireworks } = useShowFirework();
  const { t } = useLanguage();

  // Get content based on coupon type
  const getTitle = () => {
    switch (type) {
      case "spin":
        return t("profile.spin_coupon.title") || "Spin Coupon";
      case "crash":
        return t("profile.crash_ticket.title") || "Claim Crash Ticket";
      case "iphone":
        return t("profile.iphone_coupon.title") || "Claim iPhone Coupon";
      default:
        return t("profile.coupon.title");
    }
  };

  const getDescription = () => {
    switch (type) {
      case "spin":
        return (
          t("profile.spin_coupon.description") ||
          "Enter your spin coupon code to claim free spins"
        );
      case "crash":
        return (
          t("profile.crash_ticket.description") ||
          "Enter your crash ticket code to claim tickets"
        );
      case "iphone":
        return (
          t("profile.iphone_coupon.description") ||
          "Enter your iPhone coupon code to claim free iPhone"
        );
      default:
        return t("profile.coupon.description");
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "spin":
        return t("profile.spin_coupon.placeholder") || "Enter spin coupon code";
      case "crash":
        return (
          t("profile.crash_ticket.placeholder") || "Enter crash ticket code"
        );
      case "iphone":
        return (
          t("profile.iphone_coupon.placeholder") || "Enter iPhone coupon code"
        );
      default:
        return t("profile.coupon.placeholder");
    }
  };

  const getSuccessMessage = () => {
    switch (type) {
      case "spin":
        return (
          t("profile.spin_coupon.success") ||
          "Spin coupon claimed successfully!"
        );
      case "crash":
        return (
          t("profile.crash_ticket.success") ||
          "Crash ticket claimed successfully!"
        );
      case "iphone":
        return (
          t("profile.iphone_coupon.success") ||
          "iPhone coupon claimed successfully!"
        );
      default:
        return t("profile.coupon.success");
    }
  };

  const getClaimingText = () => {
    switch (type) {
      case "spin":
        return t("profile.spin_coupon.claiming") || "Claiming...";
      case "crash":
        return t("profile.crash_ticket.claiming") || "Claiming ticket...";
      case "iphone":
        return t("profile.iphone_coupon.claiming") || "Claiming iPhone...";
      default:
        return t("profile.coupon.claiming");
    }
  };

  const getButtonText = () => {
    switch (type) {
      case "spin":
        return t("profile.spin_coupon.button") || "Claim Spin";
      case "crash":
        return t("profile.crash_ticket.button") || "Claim Ticket";
      case "iphone":
        return t("profile.iphone_coupon.button") || "Claim iPhone";
      default:
        return t("profile.coupon.button");
    }
  };

  const getErrorEmpty = () => {
    switch (type) {
      case "spin":
        return (
          t("profile.spin_coupon.error.empty") ||
          "Please enter a spin coupon code"
        );
      case "crash":
        return (
          t("profile.crash_ticket.error.empty") ||
          "Please enter a crash ticket code"
        );
      case "iphone":
        return (
          t("profile.iphone_coupon.error.empty") ||
          "Please enter a iPhone coupon code"
        );
      default:
        return t("profile.coupon.error.empty");
    }
  };

  const getErrorFailed = () => {
    switch (type) {
      case "spin":
        return (
          t("profile.spin_coupon.error.failed") || "Failed to claim spin coupon"
        );
      case "crash":
        return (
          t("profile.crash_ticket.error.failed") ||
          "Failed to claim crash ticket"
        );
      case "iphone":
        return (
          t("profile.iphone_coupon.error.failed") ||
          "Failed to claim iPhone coupon"
        );
      default:
        return t("profile.coupon.error.failed");
    }
  };

  // Create stable close handler
  const handleClose = useCallback(() => {
    setOpen(false);
    // Reset state when drawer is closed
    setTimeout(() => {
      setIsSuccess(false);
      setCouponCode("");
      setSuccessMessage("");
    }, 300); // Wait for drawer close animation
  }, [setOpen]);

  const { mutate, isPending } = useMutation({
    mutationFn:
      type === "spin"
        ? claimSpinCoupon
        : type === "crash"
        ? claimCrashTicket
        : type === "iphone"
        ? (body: any) => claimIphoneCoupon("iphone-giveaway", body)
        : claimCoupon,
    onSuccess: async (data) => {
      setSuccessMessage(data.message || getSuccessMessage());
      setIsSuccess(true);
      setShowFireworks(true);
      // Call the onClaim callback if provided
      onClaim?.(data);
      // Don't close the drawer immediately to show success state
    },
    onError: (error: any) => {
      errorHandler(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      notify.failure(getErrorEmpty());
      return;
    }
    if (!phoneNumber) {
      shareContactInfo();
      return;
    }
    if (type === "spin") {
      mutate({ code: couponCode.trim() });
    } else if (type === "crash") {
      mutate({ code: couponCode.trim() });
    } else if (type === "iphone") {
      mutate({ code: couponCode.trim() });
    } else {
      mutate({ coupon_code: couponCode.trim() });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-[300px]">
        <DrawerCloseButton onClick={handleClose} />

        <div className="mx-auto w-full max-w-sm pt-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <LottiePlayer
                src="/lottie/check.lottie"
                width={60}
                height={60}
                className="mb-2"
                loop={false}
                speed={0.6}
                ignoreModalState={true}
              />
              <h3 className="text-xl font-semibold mb-2">
                {getSuccessMessage()}
              </h3>
              <p className="text-muted-foreground mb-6">{successMessage}</p>
              <Button onClick={handleClose} className="w-full">
                {t("profile.coupon.done")}
              </Button>
            </div>
          ) : (
            <>
              <DrawerHeader className="flex flex-col items-center gap-2">
                {type === "spin" ? (
                  <span className="rounded-full overflow-hidden w-14 h-14 bg-muted">
                    <LottiePlayer
                      src="/lottie/wheel.lottie"
                      width={60}
                      height={60}
                      className="-ms-[2px]"
                      ignoreModalState={true}
                    />
                  </span>
                ) : type === "crash" ? (
                  <LottiePlayer
                    src="/lottie/rocket2.lottie"
                    width={60}
                    height={60}
                    ignoreModalState={true}
                  />
                ) : type === "iphone" ? (
                  <span className="rounded-full overflow-hidden w-14 h-14 bg-muted">
                    <LottiePlayer
                      src="/lottie/wheel.lottie"
                      width={60}
                      height={60}
                      className="-ms-[2px]"
                      ignoreModalState={true}
                    />
                  </span>
                ) : (
                  <LottiePlayer
                    src="/lottie/coupon.lottie"
                    width={60}
                    height={60}
                    ignoreModalState={true}
                  />
                )}

                <DrawerTitle>{getTitle()}</DrawerTitle>
                <DrawerDescription className="text-center max-w-xs text-balance">
                  {getDescription()}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <form onSubmit={handleSubmit} className="py-4">
                  <div className="space-y-10">
                    <Input
                      id="coupon"
                      placeholder={getPlaceholder()}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-muted h-12"
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? getClaimingText() : getButtonText()}
                    </Button>
                  </div>
                </form>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
