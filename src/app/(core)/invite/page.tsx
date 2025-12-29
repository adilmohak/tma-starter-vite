"use client";

import { Button } from "@/components/ui/button";
import { Check, Clock, Copy, DollarSign } from "lucide-react";
import { copyToClipboard, getUserDisplayName, notify } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";
import { useState } from "react";
import LottiePlayer from "@/components/lottie-player";
import InactiveUserDrawer from "@/components/invite/inactive-user-drawer";
import { useLanguage } from "@/hooks/use-language";
import UserReferralExcerpt from "@/components/invite/user-referral-excerpt";
import { FadeIn } from "@/components/ui/animated";
import ClaimReferralDrawer from "@/components/invite/claim-referral-drawer";
import ParticleBurst from "@/components/particle-burst";
import AnimatedCounter from "@/components/animated-counter";

// Mock user data for demo purposes
const mockUser = {
  id: "user_123",
  username: "Demo User",
  referral_balance: 250,
  game_invite_url: "https://example.com/invite/demo123",
  game_invite_share_url:
    "https://t.me/share/url?url=https://example.com/invite/demo123",
};

// Mock referrals data
const mockReferrals = {
  total: 3,
  referrals: [
    {
      id: "ref_1",
      username: "Friend One",
      first_name: "Friend",
      last_name: "One",
      status: "credited",
      bonus_amount: 50,
      profile: { compressed_url: "/default-avatar.webp" },
    },
    {
      id: "ref_2",
      username: "Friend Two",
      first_name: "Friend",
      last_name: "Two",
      status: "credited",
      bonus_amount: 50,
      profile: { compressed_url: "/default-avatar.webp" },
    },
    {
      id: "ref_3",
      username: "Pending User",
      first_name: "Pending",
      last_name: "User",
      status: "pending",
      bonus_amount: 0,
      profile: { compressed_url: "/default-avatar.webp" },
    },
  ],
};

export default function InviteLeaderboard() {
  const user = mockUser;
  const isLoadingUser = false;
  const telegram = useTelegram();

  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isInactiveUserDrawerOpen, setIsInactiveUserDrawerOpen] =
    useState(false);
  const [selectedInactiveUser, setSelectedInactiveUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [referralBalance, setReferralBalance] = useState(
    mockUser.referral_balance
  );

  const referrals = mockReferrals;

  const { t } = useLanguage();

  // Simulated share handler
  const handleInvite = () => {
    setIsFetching(true);
    // Simulate API delay
    setTimeout(() => {
      console.log("Share invite triggered");
      notify.success("Share dialog would open here");
      setIsFetching(false);
    }, 500);
  };

  // Simulated claim referral handler
  const handleClaimReferral = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      console.log("Referral claimed");
      setReferralBalance(0);
      notify.success(t("referral_reward_claimed"));
      setIsClaimOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleInactiveUserClick = (user: any) => {
    setSelectedInactiveUser(user);
    setIsInactiveUserDrawerOpen(true);
  };

  const referralReward = referralBalance;

  return (
    <section className="app-container">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[140px]">
          <ParticleBurst />
        </div>

        <div className="main flex flex-col gap-6 w-full flex-grow pb-24 pt-5">
          {/* Header Section - Animation Delay 0s */}
          <FadeIn delay={0} className="px-5 relative">
            <div className="flex flex-col w-full justify-center text-center items-center">
              <div className="h-[80px] w-[80px]">
                <LottiePlayer
                  src="/lottie/invite.lottie"
                  width={80}
                  height={80}
                />
              </div>
              <h1 className="text-xl font-bold mt-1">
                {t("invite.header_title")}
              </h1>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="px-5">
            <div className="flex flex-col gap-3 p-3 bg-muted rounded-2xl">
              <div className="flex items-center gap-4 w-full outline-none">
                <span
                  className={
                    "size-[40px] bg-accent min-w-[35px] flex items-center justify-center rounded-lg"
                  }
                >
                  <DollarSign
                    className={"fill-accent stroke-button-text size-5"}
                  />
                </span>
                <div className="flex flex-col items-start">
                  <h3 className="font-semibold leading-snug">
                    {t("birr_per_friend")}
                  </h3>
                  <p className="flex items-center text-sm text-secondary">
                    {t("receive_birr")}
                  </p>
                </div>
              </div>

              <div className="flex items-center w-full gap-4">
                <Button
                  type="button"
                  onClick={handleInvite}
                  disabled={isFetching}
                  className="bg-button hover:bg-button/80 focus:bg-button/80 text-button-text h-12 w-full"
                >
                  {isFetching ? t("processing") : t("invite.invite_a_friend")}
                </Button>
                <Button
                  type="button"
                  className="bg-accent/10 hover:bg-accent/15 focus:bg-accent/15 w-full h-12 max-w-[50px] p-0"
                  onClick={() => {
                    copyToClipboard(user?.game_invite_url ?? "");
                    notify.success(t("invite_link_copied"));
                  }}
                >
                  <Copy className="text-button" />
                </Button>
              </div>
            </div>
          </FadeIn>

          <InactiveUserDrawer
            isOpen={isInactiveUserDrawerOpen}
            onOpenChange={setIsInactiveUserDrawerOpen}
            selectedUser={selectedInactiveUser}
            telegram={telegram}
          />

          <ClaimReferralDrawer
            isOpen={isClaimOpen}
            onOpenChange={setIsClaimOpen}
            handleClaimReferral={handleClaimReferral}
            isLoading={isLoading}
          />

          <FadeIn delay={0.2}>
            <div className="space-y-2 px-5">
              <h3 className="ms-3 text-sm text-secondary uppercase">
                {t("balance")}
              </h3>
              <div className="space-y-4 flex-1 bg-muted rounded-xl p-3">
                <div
                  className={`relative overflow-hidden text-center w-full mx-auto space-y-4`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <LottiePlayer
                      src="/lottie/money-fly.json"
                      width={44}
                      height={44}
                    />
                    <h1
                      className={`flex items-center gap-1 text-5xl tracking-wide font-bold`}
                    >
                      <AnimatedCounter
                        value={referralReward}
                        className="text-5xl tracking-wide font-bold"
                      />
                      <span className="text-lg ms-1">
                        {t("referral.currency")}
                      </span>
                    </h1>
                  </div>
                  <Button
                    type="button"
                    className={`bg-button hover:bg-button/80 focus:bg-button/80 text-button-text h-12 w-full`}
                    onClick={() => setIsClaimOpen(true)}
                    disabled={referralReward === 0}
                  >
                    {t("claim_reward")}
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="px-5">
            <div className="space-y-2">
              <h3 className="ms-3 text-sm text-secondary uppercase">
                {t("friends")} ({referrals?.total || 0} {t("invited")})
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 p-3 bg-muted rounded-2xl min-h-[57px]">
                  {!isLoadingUser && (!referrals || referrals?.total === 0) && (
                    <span className="text-center text-secondary mt-1">
                      {t("invite.no_invite")}
                    </span>
                  )}
                  {referrals?.total > 0 &&
                    referrals?.referrals?.map((user: any, index: number) => (
                      <FadeIn key={user.id} delay={0.4 + index * 0.05}>
                        <div
                          className={`${
                            user.status === "pending"
                              ? "opacity-50 cursor-pointer"
                              : ""
                          } flex w-full items-center`}
                          onClick={
                            user.status === "pending"
                              ? () => handleInactiveUserClick(user)
                              : undefined
                          }
                        >
                          <UserReferralExcerpt
                            name={getUserDisplayName(user)}
                            img={
                              user.profile?.compressed_url ??
                              user.profile?.url ??
                              "/default-avatar.webp"
                            }
                            caption="user"
                            balance={user.bonus_amount?.toLocaleString()}
                          />

                          {user.status === "credited" && (
                            <Check className="text-green-500 ms-auto w-4 h-4" />
                          )}

                          {user.status === "pending" && (
                            <Clock className="text-secondary ms-auto w-4 h-4" />
                          )}
                        </div>
                      </FadeIn>
                    ))}
                  {isLoadingUser && (
                    <span className="text-secondary ps-3">
                      {t("loading_friends")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
