import ButtonBase from "@/components/ui/button-base";
import { ArrowRight } from "lucide-react";
import { useTelegram } from "@/hooks/use-telegram";
import { useLanguage } from "@/hooks/use-language";
import { SUPPORT_BOT } from "@/lib/constants";

export default function SupportCard() {
  const telegram = useTelegram();
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <span className="ps-5 text-xs uppercase text-secondary">
        {t("help.title")}
      </span>
      <div className="rounded-xl mt-2">
        <div className="p-2 bg-muted rounded-2xl relative">
          <div className="flex flex-col gap-4">
            <ButtonBase
              onClick={() =>
                telegram?.openTelegramLink(`https://t.me/${SUPPORT_BOT}`)
              }
              type="button"
              className="flex items-center gap-2 w-full outline-none disabled:opacity-50"
            >
              <span className="inline-flex items-center justify-center rounded-full min-w-[36px] min-h-[36px]">
                <img
                  src="/support-duck.jpg"
                  width={36}
                  height={36}
                  alt="Support center"
                  className="rounded-full"
                />
              </span>
              <div className="flex flex-col flex-1 text-left">
                <div className="flex flex-wrap items-center gap-1">
                  <h3 className="text-base font-semibold leading-snug">
                    {t("help.contact_us")}
                  </h3>
                </div>
              </div>
              <div>
                <ArrowRight className="w-5 h-5" />
              </div>
            </ButtonBase>
          </div>
        </div>
        <p className="text-sm text-secondary px-3 mt-1">
          {t("help.support_description")}{" "}
          <a href={`https://t.me/${SUPPORT_BOT}`} className="text-link">
            @{SUPPORT_BOT}
          </a>
        </p>
      </div>
    </div>
  );
}
