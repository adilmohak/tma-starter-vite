import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import * as styleLorelei from "@dicebear/lorelei";
import ButtonBase from "./ui/button-base";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAvatarConfig, saveAvatarConfig } from "@/services/user-api";
import { errorHandler } from "@/lib/utils";
import { Repeat, Shuffle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/context/auth-context";

interface AvatarConfig {
  style: string;
  seed: string;
  backgroundColor: string;
  // backgroundType: "solid" | "gradientLinear";
  // scale: number;
  // rotate: number;
  // translateX: number;
  // translateY: number;
  // flip: boolean;
  // radius: number;
  // Style-specific options
  [key: string]: any;
}

const AVATAR_STYLES = [
  { name: "Lorelei", value: "lorelei", collection: styleLorelei },
];

const BACKGROUND_COLORS = [
  { name: "Blue", value: "3b82f6", gradient: "from-blue-400 to-blue-500" },
  { name: "Cyan", value: "06b6d4", gradient: "from-cyan-400 to-cyan-500" },
  { name: "Green", value: "10b981", gradient: "from-green-400 to-green-500" },
  { name: "Lime", value: "84cc16", gradient: "from-lime-400 to-lime-500" },
  {
    name: "Purple",
    value: "8b5cf6",
    gradient: "from-purple-400 to-purple-500",
  },
  {
    name: "Fuchsia",
    value: "d946ef",
    gradient: "from-fuchsia-400 to-fuchsia-500",
  },
  {
    name: "Orange",
    value: "f97316",
    gradient: "from-orange-400 to-orange-500",
  },
  { name: "Red", value: "ef4444", gradient: "from-red-400 to-red-500" },
  {
    name: "Yellow",
    value: "eab308",
    gradient: "from-yellow-400 to-yellow-500",
  },
  { name: "Gray", value: "6b7280", gradient: "from-gray-400 to-gray-500" },
  { name: "Amber", value: "f59e0b", gradient: "from-amber-400 to-amber-500" },
  { name: "Pink", value: "ec4899", gradient: "from-pink-400 to-pink-500" },
  {
    name: "Indigo",
    value: "6366f1",
    gradient: "from-indigo-400 to-indigo-500",
  },
  { name: "Teal", value: "14b8a6", gradient: "from-teal-400 to-teal-500" },
  {
    name: "Emerald",
    value: "059669",
    gradient: "from-emerald-400 to-emerald-500",
  },
  {
    name: "Violet",
    value: "7c3aed",
    gradient: "from-violet-400 to-violet-500",
  },
];

const generateRandomSeed = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default function AvatarCustomizer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  // const [currentStyle, setCurrentStyle] = useState("lorelei");
  const currentStyle = "lorelei";
  const randomSeed = generateRandomSeed();
  const { t } = useLanguage();
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    style: "lorelei",
    seed: randomSeed,
    backgroundColor: "3b82f6",
    // backgroundType: "solid",
    // scale: 100,
    // rotate: 0,
    // translateX: 0,
    // translateY: 0,
    // flip: false,
    // radius: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useAuth();

  // const [styleOptions, setStyleOptions] = useState<{ [key: string]: any }>({});

  const handleClose = () => {
    setOpen(false);
  };

  const { data: avatarConfigData } = useQuery({
    queryKey: ["avatarConfig"],
    queryFn: getAvatarConfig,
  });

  const resetAvatarConfig = () => {
    console.log("Setting avatarConfigData");
    setAvatarConfig({
      ...avatarConfig,
      style: user?.avatar?.name || "lorelei",
      seed: user?.avatar?.image_url?.split("seed=")[1] || randomSeed,
      backgroundColor:
        user?.avatar?.color?.replace("#", "") ||
        avatarConfigData?.colors[0]?.replace("#", "") ||
        "3b82f6",
    });
  };

  useEffect(() => {
    resetAvatarConfig();
  }, [avatarConfigData, user]);

  const avatarMutation = useMutation({
    mutationFn: saveAvatarConfig,
    onSuccess: (data) => {
      setUser({ ...user, avatar: data?.avatar });
      setIsSubmitting(false);
      setOpen(false);
    },
    onError: (error) => {
      errorHandler(error);
      setIsSubmitting(false);
    },
  });

  const handleSaveChanges = () => {
    // Here you would typically save the avatar configuration to your backend
    setIsSubmitting(true);
    avatarMutation.mutate({
      seed: avatarConfig.seed,
      color: `#${avatarConfig.backgroundColor}`,
      pseudo_name: avatarConfig.style,
    });
  };

  const updateConfig = (key: string, value: any) => {
    const cleanedValue = value.replace("#", "");
    setAvatarConfig((prev) => ({ ...prev, [key]: cleanedValue }));
  };

  // const updateStyleOption = (key: string, value: any) => {
  //   setStyleOptions((prev) => ({ ...prev, [key]: value }));
  // };

  const generateAvatarUrl = useMemo(() => {
    const styleData = AVATAR_STYLES.find((s) => s.value === currentStyle);
    if (!styleData) return "";

    try {
      const avatar = createAvatar(styleData.collection as any, {
        seed: avatarConfig.seed,
        backgroundColor: [avatarConfig.backgroundColor],
        backgroundType: [avatarConfig.backgroundType],
        scale: avatarConfig.scale,
        rotate: avatarConfig.rotate,
        translateX: avatarConfig.translateX,
        translateY: avatarConfig.translateY,
        flip: avatarConfig.flip,
        radius: avatarConfig.radius,
      });

      return avatar.toDataUri();
    } catch (error) {
      console.error("Error generating avatar:", error);
      return "";
    }
  }, [currentStyle, avatarConfig]);

  const randomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    updateConfig("seed", randomSeed);
  };

  // Generate 26 random Lorelei avatars
  const generateRandomLoreleiAvatars = useMemo(() => {
    const avatars = [];
    for (let i = 0; i < 50; i++) {
      const seed = Math.random().toString(36).substring(2, 15);
      try {
        const avatar = createAvatar(styleLorelei as any, {
          seed,
          size: 40,
        });
        avatars.push({
          id: i,
          seed,
          url: avatar.toDataUri(),
        });
      } catch (error) {
        console.error(`Error generating random avatar ${i}:`, error);
      }
    }
    return avatars;
  }, []); // Empty dependency array so avatars are generated once and stay consistent

  const selectAvatar = (seed: string) => {
    updateConfig("seed", seed);
  };

  // const currentStyleData = AVATAR_STYLES.find((s) => s.value === currentStyle);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="min-h-[90vh] max-h-[90vh]">
        <DrawerCloseButton onClick={handleClose} />

        <DrawerHeader className="flex flex-col items-center gap-2 pt-5">
          <DrawerTitle className="sr-only">
            {t("profile.avatar.title")}
          </DrawerTitle>
          <motion.div
            className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-lg"
            key={generateAvatarUrl} // This ensures animation triggers when avatar changes
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.5,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={generateAvatarUrl}
                alt="Avatar Preview"
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
          <div className="border rounded-lg flex divide-x gap-2 justify-center">
            <ButtonBase
              onClick={randomizeAvatar}
              className="text-xs p-2 flex gap-1 items-center"
            >
              <Shuffle size={16} className="mr-1" />{" "}
              {t("profile.avatar.randomize")}
            </ButtonBase>
            {/* <ButtonBase
              onClick={() => updateConfig("flip", !avatarConfig.flip)}
              className="text-xs p-2 flex gap-1 items-center"
            >
              {avatarConfig.flip ? (
                <Undo2 size={16} className="mr-1" />
              ) : (
                <Redo2 size={16} className="mr-1" />
              )}
              Flip
            </ButtonBase> */}
            <ButtonBase
              onClick={resetAvatarConfig}
              className="text-xs p-2 flex gap-1 items-center"
            >
              <Repeat size={16} className="mr-1" /> Reset
            </ButtonBase>
          </div>
        </DrawerHeader>

        <div className="pt-5 flex flex-col h-full max-h-[90vh] md:max-h-[90vh] overflow-hidden safe-area-padding-bottom">
          {/* <div className="mx-auto w-full max-w-4xl pt-5 px-4"> */}

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 mt-0 pb-3 px-4">
              {/* Background Colors */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-center text-secondary">
                  {t("profile.avatar.background_color")}
                </p>
                <div className="flex overflow-x-auto gap-2 p-1 bg-muted rounded-xl">
                  {/* {BACKGROUND_COLORS.map((color) => (
                    <ButtonBase
                      key={color.value}
                      onClick={() =>
                        updateConfig("backgroundColor", color.value)
                      }
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all ${
                        avatarConfig.backgroundColor === color.value
                          ? "border-primary"
                          : "border-muted hover:scale-105"
                      }`}
                      style={{ backgroundColor: `#${color.value}` }}
                      title={color.name}
                    />
                  ))} */}
                  {avatarConfigData?.colors?.map((color: string) => (
                    <ButtonBase
                      key={color}
                      onClick={() => updateConfig("backgroundColor", color)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all ${
                        avatarConfig.backgroundColor === color?.replace("#", "")
                          ? "border-primary"
                          : "border-muted hover:scale-105"
                      }`}
                      style={{ backgroundColor: `${color}` }}
                    />
                  ))}
                </div>
              </div>

              {/* Lorelei Avatars Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-center text-secondary">
                  {t("profile.avatar.choose_avatar")}
                </p>
                <div className="grid grid-cols-5 md:grid-cols-7 gap-2 bg-muted rounded-xl p-3">
                  {generateRandomLoreleiAvatars.map((avatar) => (
                    <ButtonBase
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.seed)}
                      className={`rounded-full transition-all ${
                        avatarConfig.seed === avatar.seed
                          ? "bg-accent/25 ring-2 ring-primary"
                          : "hover:scale-105"
                      }`}
                    >
                      <Image
                        src={avatar.url}
                        alt={`Lorelei avatar ${avatar.id}`}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </ButtonBase>
                  ))}
                </div>
              </div>
            </div>

            <DrawerFooter className="mt-6 sticky bottom-0 bg-muted safe-area-padding-bottom">
              <Button
                type="submit"
                className="w-full py-3 h-auto"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("profile.avatar.saving")
                  : t("profile.avatar.set_profile")}
              </Button>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
