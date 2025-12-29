import React from "react";
import { PulseLoader } from "react-spinners";
import ButtonBase from "./ui/button-base";
import { ChevronRight, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  DrawerDescription,
} from "./ui/drawer";

const LanguageSelector = ({
  triggerBtnText,
  options,
  activeOption,
  isLoading,
  open,
  setOpen,
  handleOptionClick,
}: {
  triggerBtnText: string;
  options: { name: string; id: string; icon?: string }[];
  activeOption?: string;
  isLoading: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOptionClick: (optionId: string) => void;
}) => {
  const { t } = useLanguage();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <ButtonBase
        className="w-full"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <li className="flex items-center gap-2 py-3">
          <span className="bg-green-500 rounded-md size-[25px] flex items-center justify-center">
            <Globe width={20} className="fill-white text-green-500" />
          </span>
          <span className="font-medium">{t("profile.language")}</span>{" "}
          <div className="ms-auto flex items-center gap-1 text-secondary">
            <p className="text-sm font-medium">{triggerBtnText}</p>
            <ChevronRight
              size={20}
              strokeWidth={3}
              className={`transition-all duration-300`}
            />
          </div>
        </li>
      </ButtonBase>

      <DrawerContent>
        <DrawerCloseButton onClick={() => setOpen(false)} />
        <DrawerHeader className="p-6">
          <DrawerTitle className="text-left">
            {t("profile.language")}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Select your language.
          </DrawerDescription>
        </DrawerHeader>

        {isLoading && (
          <div className="absolute z-10 inset-0 bg-black/25 flex items-center justify-center rounded-lg">
            <PulseLoader color="#c9c9c9" />
          </div>
        )}

        <div className="relative px-6 pb-6">
          <div className="space-y-2">
            {options.map((option) => (
              <ButtonBase
                key={option.id}
                onClick={async () => {
                  await handleOptionClick(option.id);
                  // setOpen(false);
                }}
                className={`text-left w-full px-4 py-3 rounded-lg hover:bg-muted flex gap-3 items-center transition-colors ${
                  activeOption === option.id ? "bg-muted text-accent" : ""
                }`}
                disabled={isLoading}
              >
                {option.icon && (
                  <span className="rounded-full inline-flex items-center justify-center w-9 h-9 overflow-hidden text-7xl">
                    <div className="mt-[6px]">{option.icon}</div>
                  </span>
                )}
                <span className="text-base">{option.name}</span>
              </ButtonBase>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LanguageSelector;
