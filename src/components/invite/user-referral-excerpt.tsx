"use client";

import { toHumanReadable } from "@/lib/typography";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useLanguage } from "@/hooks/use-language";

type UserProps = {
  img: string;
  caption?: string;
  name: string;
  balance: number;
  rank?: number;
  link?: string;
};

const UserReferralExcerpt = ({
  name,
  img,
  caption,
  balance,
  rank,
  link,
}: UserProps) => {
  const { t } = useLanguage();

  return link ? (
    <Link href={link} className="flex items-center justify-between">
      <div className="flex items-center gap-4 w-full outline-none">
        <Image
          src={img}
          alt={caption ?? ""}
          width={44}
          height={44}
          className="rounded-full"
          priority
        />
        <div className="flex flex-col justify-start">
          <h3 className="text-sm font-semibold leading-snug capitalize max-w-40 overflow-hidden text-ellipsis text-nowrap">
            {toHumanReadable(name)}
          </h3>
          <span className="flex items-center text-sm text-orange-300">
            +{balance?.toLocaleString()} {t("referral.currency")}
          </span>
        </div>
      </div>
      {rank && <span className="text-lg">{rank}</span>}
    </Link>
  ) : (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 w-full outline-none">
        <Image
          src={img}
          alt={caption ?? ""}
          width={44}
          height={44}
          className="rounded-full"
          priority
        />
        <div className="flex flex-col justify-start">
          <h3 className="text-sm font-semibold leading-snug capitalize max-w-40 overflow-hidden text-ellipsis text-nowrap">
            {toHumanReadable(name)}
          </h3>
          <span className="flex items-center text-sm text-orange-300">
            +{balance?.toLocaleString()} {t("referral.currency")}
          </span>
        </div>
      </div>
      {rank && <span className="text-lg">#{rank}</span>}
    </div>
  );
};

export default UserReferralExcerpt;

