"use client";

import { ChevronRight, Palette, Smile } from "lucide-react";
import { PremiumStar, Ticket } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { locales } from "@/lib/constants";
import { getLocaleName } from "@/lib/utils";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/hooks/use-language";
import ButtonBase from "@/components/ui/button-base";
import CouponDrawer from "@/components/coupon-drawer";
import { FadeIn } from "@/components/ui/animated";
import SupportCard from "@/components/support-card";
import ThemeDrawer from "@/components/theme-drawer";
import AvatarCustomizer from "@/components/avatar-customizer";

// Mock user data for demo purposes
const mockUser = {
  id: "user_123",
  username: "Demo User",
  tickets: 150,
  avatar: {
    image_url: "/default-avatar.webp",
    color: "#ffc738",
  },
  profile: {
    compressed_url: "/default-avatar.webp",
  },
};

export default function Profile() {
  const { locale, t, setLocale } = useLanguage();
  const user = mockUser;
  const localeName = getLocaleName(locale) ?? "English";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openCouponDrawer, setOpenCouponDrawer] = useState(false);
  const [openThemeDrawer, setOpenThemeDrawer] = useState(false);

  // Simulated language change handler
  const handleLangChange = (lang: string) => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      console.log("Language changed to:", lang);
      setLocale(lang as Locale);
      setIsSubmitting(false);
      setOpenList(false);
    }, 500);
  };

  const [openAvatarSetting, setOpenAvatarSetting] = useState(false);

  // Auto-open theme drawer for first-time visitors
  useEffect(() => {
    const hasSeenThemeDrawer = localStorage.getItem("tma-theme-drawer-seen");

    if (!hasSeenThemeDrawer) {
      // Small delay to ensure page is loaded and feels natural
      const timer = setTimeout(() => {
        setOpenThemeDrawer(true);
        localStorage.setItem("tma-theme-drawer-seen", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="app-container flex flex-col">
      <div className="flex flex-col gap-8 w-full flex-grow h-full pt-5 pb-28">
        <CouponDrawer open={openCouponDrawer} setOpen={setOpenCouponDrawer} />

        {/* Profile Header - Animation Delay 0s */}
        <FadeIn delay={0}>
          <div className="flex flex-col w-full justify-center text-center items-center px-5">
            <ButtonBase
              onClick={() => setOpenAvatarSetting(true)}
              className="relative w-[80px] h-[80px]"
            >
              <img
                src={
                  user?.avatar?.image_url ||
                  user?.profile?.compressed_url ||
                  "/default-avatar.webp"
                }
                style={{
                  backgroundColor: user?.avatar?.color || "#ffc738",
                }}
                alt="Avatar"
                className="w-full h-full object-fill rounded-full"
              />
              <div className="absolute bottom-0 right-[2px] w-7 h-7 bg-background border border-accent/10 rounded-full flex items-center justify-center">
                <Smile size={20} className="text-background fill-accent" />
              </div>
            </ButtonBase>
            <h1 className="text-2xl font-bold mt-1">{user?.username}</h1>
          </div>
        </FadeIn>

        {/* <AvatarSetting
          open={openAvatarSetting}
          setOpen={setOpenAvatarSetting}
        /> */}

        <AvatarCustomizer
          open={openAvatarSetting}
          setOpen={setOpenAvatarSetting}
        />

        <ThemeDrawer open={openThemeDrawer} setOpen={setOpenThemeDrawer} />

        {/* Settings Menu - Animation Delay 0.1s */}
        <FadeIn delay={0.1}>
          <div className="mx-5">
            <div className="bg-muted rounded-xl">
              <ul className="list-none flex flex-col py-0">
                {/* {process.env.NEXT_PUBLIC_ENV === "development" && (
              <motion.li
                className="flex items-center gap-2 py-3 rounded-lg"
                animate={balanceAnimation}
                initial={{
                  scale: 1,
                  x: 0,
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
              >
                <DollarSign />
                <span>Balance</span>
                <span className="flex items-center gap-1 bg-button-opacity rounded-full px-2 py-1 text-button">
                  {user && user.cash_balance?.toLocaleString()} Birr
                </span>
                <span className="ms-auto flex items-center gap-1">
                  <WithdrawDrawer />
                </span>
              </motion.li>
            )} */}

                {/* {isDevelopment && (
                  <>
                    <li className="px-2">
                      <ButtonBase
                        onClick={() => setOpenAvatarSetting(true)}
                        className="w-full flex items-center gap-2 py-3"
                      >
                        <span className="bg-orange-500 rounded-md size-[25px] flex items-center justify-center">
                          <Smile
                            size={20}
                            className="fill-white text-orange-500"
                          />
                        </span>
                        <span className="font-medium">
                          {t("profile.profile")}
                        </span>{" "}
                        <div className="ms-auto flex items-center gap-1 text-secondary">
                          <ChevronRight
                            size={20}
                            strokeWidth={3}
                            className={`transition-all duration-300`}
                          />
                        </div>
                      </ButtonBase>
                    </li>
                    <div className="h-px bg-border/45 w-[89%] ms-auto" />
                  </>
                )} */}

                <li className="px-2">
                  <ButtonBase
                    onClick={() => setOpenCouponDrawer(true)}
                    className="w-full flex items-center gap-2 py-3"
                  >
                    <span className="bg-blue-500 rounded-md size-[25px] flex items-center justify-center">
                      <PremiumStar />
                    </span>
                    <span className="font-medium">{t("profile.coupons")}</span>{" "}
                    <div className="ms-auto flex items-center gap-1 text-secondary">
                      <ChevronRight
                        size={20}
                        strokeWidth={3}
                        className={`transition-all duration-300`}
                      />
                    </div>
                  </ButtonBase>
                </li>
                <div className="h-px bg-border w-[89%] ms-auto" />

                <li className="flex items-center gap-2 py-3 px-2">
                  <span className="bg-red-500 rounded-md size-[25px] flex items-center justify-center">
                    <Ticket size={20} />
                  </span>
                  <span className="font-medium">{t("profile.tickets")}</span>{" "}
                  <div className="ms-auto font-medium pr-2">
                    {user && user.tickets?.toLocaleString()}
                  </div>
                </li>
                <div className="h-px bg-border w-[89%] ms-auto" />

                <li className="px-2">
                  <LanguageSelector
                    triggerBtnText={`${
                      localeName.toLowerCase() === "english" ? "🇬🇧" : "🇪🇹"
                    } ${localeName}`}
                    options={locales}
                    isLoading={isSubmitting}
                    open={openList}
                    setOpen={setOpenList}
                    handleOptionClick={handleLangChange}
                    activeOption={locale}
                  />
                </li>
                {/* <div className="h-px bg-border w-[89%] ms-auto" />

                <li className="px-2">
                  <ButtonBase
                    onClick={() =>
                      telegram?.openTelegramLink(
                        `https://t.me/${SUPPORT_BOT}`
                      )
                    }
                    className="w-full flex items-center gap-2 py-3"
                  >
                    <span className="bg-gray-500 rounded-md size-[25px] flex items-center justify-center">
                      <MessageCircleMore className="fill-white text-gray-500" />
                    </span>
                    <span className="font-medium">{t("profile.question")}</span>{" "}
                    <div className="ms-auto flex items-center gap-1 text-secondary">
                      <ChevronRight
                        size={20}
                        strokeWidth={3}
                        className={`transition-all duration-300`}
                      />
                    </div>
                  </ButtonBase>
                </li> */}
              </ul>
            </div>

            {/* {isDevelopment && ( */}
            <div className="mt-3 bg-muted rounded-xl">
              <ul className="list-none flex flex-col py-0">
                <li className="px-2">
                  <ButtonBase
                    onClick={() => setOpenThemeDrawer(true)}
                    className="w-full flex items-center gap-2 py-3"
                  >
                    <span className="bg-violet-500 rounded-md size-[25px] flex items-center justify-center">
                      <Palette
                        size={20}
                        className="fill-white text-violet-500"
                      />
                    </span>
                    <span className="font-medium">
                      {t("profile.theme.title")}
                    </span>{" "}
                    <div className="ms-auto flex items-center gap-1 text-secondary">
                      <ChevronRight
                        size={20}
                        strokeWidth={3}
                        className={`transition-all duration-300`}
                      />
                    </div>
                  </ButtonBase>
                </li>
              </ul>
            </div>
            {/* )} */}
          </div>
        </FadeIn>

        <div className="mt-auto px-3">
          <SupportCard />
        </div>
      </div>
    </section>
  );
}
